
import React, { useState, useEffect, useRef } from 'react';
import { Level, GameAction, Position, Direction, CellType, LogEntry, StudentSession } from '../types';
import Visualizer from './Visualizer';
import CodeEditor from './CodeEditor';
import { getGeminiHint } from '../services/geminiService';

interface GameInterfaceProps {
  level: Level;
  studentSession: StudentSession | null;
  onLevelComplete: (success: boolean, timeTaken: number, attempts: number) => void;
  onBack: () => void;
}

// Enhanced Parser with Variable Support
const parsePythonCode = (code: string): { actions: GameAction[], error: string | null } => {
  const lines = code.split('\n');
  const actions: GameAction[] = [];
  let error: string | null = null;
  const variables: { [key: string]: number } = {};

  try {
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      // Remove comments
      if (line.includes('#')) {
          line = line.split('#')[0].trim();
      }
      if (!line) continue;

      // 1. Handle Variable Assignment: e.g., steps = 5
      if (line.includes('=') && !line.startsWith('for ') && !line.startsWith('if ')) {
          const parts = line.split('=');
          if (parts.length === 2) {
              const varName = parts[0].trim();
              const varValue = parts[1].trim();
              
              if (!/^[a-zA-Z_]\w*$/.test(varName)) {
                  throw new Error(`Line ${i+1}: 變數名稱 '${varName}' 無效`);
              }

              const numericValue = parseInt(varValue);
              if (!isNaN(numericValue)) {
                  variables[varName] = numericValue;
              } else if (variables[varValue] !== undefined) {
                  variables[varName] = variables[varValue]; // Assign from another variable
              } else {
                  // For now, only support integer assignment
                   throw new Error(`Line ${i+1}: 目前只支援整數賦值，例如 x = 5`);
              }
              continue; // Assignment doesn't produce an action
          }
      }

      // 2. Handle For Loop: e.g., for i in range(5): or for i in range(steps):
      if (line.startsWith('for ') && line.includes('in range(')) {
        const match = line.match(/range\(([^)]+)\):/);
        if (!match) throw new Error(`Line ${i+1}: 迴圈語法錯誤。`);
        
        let rangeValStr = match[1].trim();
        let count = 0;

        if (!isNaN(parseInt(rangeValStr))) {
            count = parseInt(rangeValStr);
        } else if (variables[rangeValStr] !== undefined) {
            count = variables[rangeValStr];
        } else {
            throw new Error(`Line ${i+1}: 未知的變數 '${rangeValStr}'`);
        }
        
        const loopBlock: string[] = [];
        let j = i + 1;
        // Simple indentation check
        while (j < lines.length && (lines[j].startsWith('    ') || lines[j].trim() === '')) {
            if(lines[j].trim() !== '') loopBlock.push(lines[j].trim());
            j++;
        }

        // Recursively parse the block (simplified: just unroll loop)
        for (let k = 0; k < count; k++) {
            loopBlock.forEach(loopLine => {
               if (loopLine.includes('hero.move_')) {
                   const action = parseCommand(loopLine, i+1, variables);
                   actions.push(...action);
               }
            });
        }
        i = j - 1;
        continue;
      }

      // 3. Handle Standard Commands with Arguments
      if (line.startsWith('hero.move_')) {
          const cmds = parseCommand(line, i+1, variables);
          actions.push(...cmds);
      } else {
          throw new Error(`Line ${i+1}: 看不懂指令 '${line}'`);
      }
    }
  } catch (err: any) {
      error = err.message;
  }
  return { actions, error };
};

const parseCommand = (line: string, lineNo: number, vars: {[key:string]:number}): GameAction[] => {
    const match = line.match(/hero\.move_(\w+)\((.*)\)/);
    if (!match) throw new Error(`Line ${lineNo}: 指令格式錯誤`);

    const direction = match[1]; 
    const arg = match[2].trim();
    let steps = 1; 

    if (arg !== "") {
        if (!isNaN(parseInt(arg))) {
            steps = parseInt(arg);
        } else if (vars[arg] !== undefined) {
            steps = vars[arg];
        } else {
            throw new Error(`Line ${lineNo}: 變數 '${arg}' 尚未定義`);
        }
    }

    const typeMap: {[key:string]: any} = {
        'up': 'move_up',
        'down': 'move_down',
        'left': 'move_left',
        'right': 'move_right'
    };

    if (!typeMap[direction]) throw new Error(`Line ${lineNo}: 未知的方向 '${direction}'`);

    const result: GameAction[] = [];
    for(let k=0; k<steps; k++) {
        result.push({ type: typeMap[direction], lineNo });
    }
    return result;
};


const GameInterface: React.FC<GameInterfaceProps> = ({ level, studentSession, onLevelComplete, onBack }) => {
  const [code, setCode] = useState(level.initialCode);
  const [isPlaying, setIsPlaying] = useState(false);
  const [heroPos, setHeroPos] = useState<Position>({ ...level.startPos });
  const [heroDir, setHeroDir] = useState<Direction>(Direction.RIGHT);
  const [collectedItems, setCollectedItems] = useState<Position[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([{ type: 'info', message: level.tutorialText }]);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Stats
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [timerActive, setTimerActive] = useState(true);

  // Sync Timer when level prop updates
  useEffect(() => {
    setTimeLeft(level.timeLimit);
    setTimerActive(true);
    setHeroPos({ ...level.startPos });
    setCollectedItems([]);
    setLogs([{ type: 'info', message: level.tutorialText }]);
    setCode(level.initialCode);
    setAttempts(0);
    setIsPlaying(false);
  }, [level]);

  // Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0 && !isPlaying) { 
       interval = setInterval(() => {
           setTimeLeft(prev => prev - 1);
       }, 1000);
    } else if (timeLeft === 0 && timerActive) {
        setTimerActive(false);
        addLog({ type: 'error', message: "⏰ 時間到！請重試。" });
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, isPlaying]);

  const addLog = (entry: LogEntry) => {
    setLogs(prev => [...prev, entry]);
  };

  const checkWinCondition = (finalPos: Position, items: Position[]) => {
    const isAtGoal = level.layout[finalPos.y][finalPos.x] === CellType.GOAL;
    let totalCoins = 0;
    level.layout.forEach(row => row.forEach(cell => { if (cell === CellType.COIN) totalCoins++; }));
    return isAtGoal && items.length === totalCoins;
  };

  const triggerAiHelp = async (errorMsg: string) => {
    setAiLoading(true);
    addLog({ type: 'ai', message: "AI 助教正在分析..." });
    const hint = await getGeminiHint(code, errorMsg, level);
    addLog({ type: 'ai', message: `🤖: ${hint}` });
    setAiLoading(false);
  };

  const handleRunCode = async () => {
    if (isPlaying || timeLeft <= 0) return;
    setAttempts(prev => prev + 1);

    // Reset visual partial state
    setHeroPos({ ...level.startPos });
    setHeroDir(Direction.RIGHT);
    setCollectedItems([]);
    setLogs([{ type: 'info', message: "執行中..." }]);

    const { actions, error } = parsePythonCode(code);

    if (error) {
        addLog({ type: 'error', message: error });
        await triggerAiHelp(error);
        return;
    }

    setIsPlaying(true);
    let currentPos = { ...level.startPos };
    let currentDir = Direction.RIGHT;
    let currentCollected = [] as Position[];
    let crashed = false;

    // Execute Actions
    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        await new Promise(r => setTimeout(r, 400)); // Animation speed

        let nextPos = { ...currentPos };
        switch (action.type) {
            case 'move_up': nextPos.y -= 1; currentDir = Direction.UP; break;
            case 'move_down': nextPos.y += 1; currentDir = Direction.DOWN; break;
            case 'move_left': nextPos.x -= 1; currentDir = Direction.LEFT; break;
            case 'move_right': nextPos.x += 1; currentDir = Direction.RIGHT; break;
        }

        // Check boundaries and walls
        if (
            nextPos.x < 0 || nextPos.x >= level.gridSize ||
            nextPos.y < 0 || nextPos.y >= level.gridSize ||
            level.layout[nextPos.y][nextPos.x] === CellType.WALL
        ) {
            addLog({ type: 'error', message: `撞牆了！Line ${action.lineNo}` });
            crashed = true;
            setHeroDir(currentDir);
            break;
        }

        currentPos = nextPos;
        setHeroPos(currentPos);
        setHeroDir(currentDir);

        const cellType = level.layout[currentPos.y][currentPos.x];
        if (cellType === CellType.COIN) {
             if (!currentCollected.some(p => p.x === currentPos.x && p.y === currentPos.y)) {
                 currentCollected = [...currentCollected, currentPos];
                 setCollectedItems(currentCollected);
                 addLog({ type: 'success', message: "✨ 獲得數據碎片 (Coin)！" });
             }
        } else if (cellType === CellType.OBSTACLE) {
            addLog({ type: 'error', message: "遭到防火牆攔截！任務失敗。" });
            crashed = true;
            break;
        }
    }

    setIsPlaying(false);

    if (!crashed) {
        if (checkWinCondition(currentPos, currentCollected)) {
            setTimerActive(false);
            addLog({ type: 'success', message: "🎉 恭喜！系統駭入成功！" });
            setTimeout(() => {
                onLevelComplete(true, level.timeLimit - timeLeft, attempts);
            }, 1500);
        } else {
            addLog({ type: 'info', message: "未達成目標位置。" });
            await triggerAiHelp("程式執行完畢，但未到達目標。");
        }
    } else {
         await triggerAiHelp("角色撞擊障礙物。");
    }
  };

  const resetGame = () => {
      setHeroPos({ ...level.startPos });
      setHeroDir(Direction.RIGHT);
      setCollectedItems([]);
      setTimeLeft(level.timeLimit);
      setTimerActive(true);
      setLogs([{type: 'info', message: "重置關卡"}]);
  };

  return (
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Visualizer */}
        <div className="flex-1 p-6 flex flex-col items-center bg-[#0d1117] relative overflow-y-auto">
             <div className="w-full flex justify-between items-start mb-4 max-w-lg">
                 <div>
                    <button onClick={onBack} className="text-slate-500 hover:text-white mb-2 text-sm">&larr; 放棄關卡</button>
                    <h2 className="text-2xl font-bold text-hk-neon-blue">{level.title}</h2>
                 </div>
                 <div className="flex flex-col items-end">
                     <div className={`text-2xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-300'}`}>
                         {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                     </div>
                     {studentSession && (
                         <div className="text-xs text-slate-500 mt-1">
                             {studentSession.studentClass} ({studentSession.classNumber})
                         </div>
                     )}
                 </div>
             </div>
             
             <div className="bg-slate-800/50 p-3 rounded border border-slate-700 mb-4 w-full max-w-lg">
                 <p className="text-green-400 font-medium text-sm">🎯 目標: {level.objective}</p>
                 <p className="text-slate-400 text-xs mt-1">{level.pythonConcept}</p>
             </div>

             <Visualizer 
                level={level} 
                heroPosition={heroPos} 
                heroDirection={heroDir}
                collectedItems={collectedItems}
                characterId={studentSession?.characterId} // Pass selected character
             />
             
             {timeLeft === 0 && (
                 <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
                     <h2 className="text-red-500 text-4xl font-bold mb-4">連線中斷 (Time's Up)</h2>
                     <button onClick={resetGame} className="px-6 py-2 bg-hk-neon-blue text-black font-bold rounded hover:scale-105">重連系統 (Retry)</button>
                 </div>
             )}
        </div>

        {/* Right: Code & Logs */}
        <div className="w-full md:w-[45%] flex flex-col border-l border-slate-700 bg-[#1e1e1e]">
            <div className="h-12 bg-hk-panel border-b border-slate-700 flex items-center px-4 justify-between">
                <span className="text-sm font-bold text-slate-300">Python 編輯器</span>
                <button 
                    onClick={handleRunCode}
                    disabled={isPlaying || timeLeft === 0}
                    className={`px-6 py-1.5 rounded font-bold text-sm transition-all
                        ${isPlaying || timeLeft === 0
                            ? 'bg-slate-600 text-slate-400' 
                            : 'bg-hk-neon-blue text-black hover:bg-[#33f3ff] hover:shadow-[0_0_15px_#00f0ff]'
                        }`}
                >
                    {isPlaying ? '執行中...' : '▶ 執行代碼'}
                </button>
            </div>

            <div className="flex-1 relative h-1/2">
                <CodeEditor code={code} onChange={setCode} disabled={isPlaying || timeLeft === 0} />
            </div>

            <div className="h-64 bg-black border-t border-slate-700 flex flex-col">
                <div className="h-8 bg-[#333] px-4 flex items-center justify-between text-xs text-slate-300 font-mono border-b border-[#444]">
                    <span>系統終端機 (System Terminal)</span>
                    <span>嘗試次數: {attempts}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2">
                    {logs.map((log, i) => (
                        <div key={i} className={`
                            ${log.type === 'error' ? 'text-red-400' : ''}
                            ${log.type === 'success' ? 'text-green-400' : ''}
                            ${log.type === 'info' ? 'text-slate-300' : ''}
                            ${log.type === 'ai' ? 'text-hk-neon-pink bg-hk-neon-pink/10 p-2 rounded border-l-2 border-hk-neon-pink' : ''}
                        `}>
                            {log.type === 'ai' && <strong className="block mb-1 text-[10px] uppercase">AI 助教</strong>}
                            {log.type !== 'ai' && <span className="opacity-50 mr-2">{'>'}</span>}
                            {log.message}
                        </div>
                    ))}
                    {aiLoading && <div className="text-hk-neon-pink animate-pulse">🤖 分析數據中...</div>}
                </div>
            </div>
        </div>
      </div>
  );
};

export default GameInterface;

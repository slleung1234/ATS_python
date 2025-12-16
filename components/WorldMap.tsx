import React from 'react';
import { LEVELS } from '../constants';
import { Level } from '../types';

interface WorldMapProps {
  unlockedLevels: number; // Max level ID unlocked
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ unlockedLevels, onSelectLevel, onBack }) => {
  return (
    <div className="flex-1 bg-[#0d1117] relative overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-[#0d1117] to-[#0d1117]"></div>
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-hk-neon-pink rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-hk-neon-blue rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      </div>

      <div className="z-10 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-12">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
                &larr; 返回首頁
            </button>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-hk-neon-blue to-hk-neon-pink">
                香港冒險地圖
            </h2>
            <div className="w-20"></div> {/* Spacer */}
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 px-12">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-2 md:w-full md:h-2 md:left-0 md:top-1/2 bg-slate-800 -z-10 rounded"></div>
            
            {LEVELS.map((level, index) => {
                const isLocked = level.id > unlockedLevels;
                const isCurrent = level.id === unlockedLevels;
                
                return (
                    <button
                        key={level.id}
                        disabled={isLocked}
                        onClick={() => onSelectLevel(level)}
                        className={`
                            relative w-48 h-64 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-4 group
                            ${isLocked 
                                ? 'border-slate-700 bg-slate-900/50 opacity-50 cursor-not-allowed grayscale' 
                                : 'border-hk-neon-blue bg-hk-panel hover:scale-105 hover:shadow-[0_0_30px_#00f0ff55] cursor-pointer'
                            }
                        `}
                    >
                        <div className={`text-4xl mb-4 ${isLocked ? 'text-slate-600' : 'text-hk-neon-blue'}`}>
                            {level.id === 1 ? '🏙️' : level.id === 2 ? '🥧' : '🦁'}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{level.title}</h3>
                        <div className="text-xs text-slate-400 text-center">{level.pythonConcept}</div>
                        
                        {!isLocked && (
                            <div className="mt-4 px-3 py-1 bg-hk-neon-blue text-black text-xs font-bold rounded">
                                START
                            </div>
                        )}
                        {isLocked && <div className="mt-4 text-xs text-red-500 font-mono">LOCKED</div>}
                    </button>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default WorldMap;

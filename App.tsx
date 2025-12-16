
import React, { useState } from 'react';
import { AppScreen, Level, StudentSession } from './types';
import { LEVELS as INITIAL_LEVELS } from './constants';
import WorldMap from './components/WorldMap';
import GameInterface from './components/GameInterface';
import TeacherDashboard from './components/TeacherDashboard';
import StudentLogin from './components/StudentLogin';
import CharacterSelection from './components/CharacterSelection';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.HOME);
  const [levels, setLevels] = useState<Level[]>(INITIAL_LEVELS);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null); 
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null);

  const handleStartLogin = () => {
    setCurrentScreen(AppScreen.LOGIN);
  };

  const handleLoginSuccess = (session: StudentSession) => {
    setStudentSession(session);
    // After login, go to Character Selection instead of Map
    setCurrentScreen(AppScreen.CHARACTER_SELECT);
  };

  const handleCharacterSelected = (characterId: string) => {
    if (studentSession) {
        setStudentSession({ ...studentSession, characterId });
    }
    setCurrentScreen(AppScreen.MAP);
  };

  const handleStartGame = (level: Level) => {
    setSelectedLevelId(level.id);
    setCurrentScreen(AppScreen.GAME);
  };

  const handleLevelComplete = (success: boolean, timeTaken: number, attempts: number) => {
      if (success && selectedLevelId) {
          if (selectedLevelId === unlockedLevels) {
              setUnlockedLevels(prev => prev + 1);
          }
          alert(`恭喜完成！耗時 ${timeTaken} 秒，嘗試 ${attempts} 次。`);
          setCurrentScreen(AppScreen.MAP);
      }
  };

  const handleUpdateLevelTime = (id: number, newTime: number) => {
    setLevels(prevLevels => prevLevels.map(lvl => 
      lvl.id === id ? { ...lvl, timeLimit: newTime } : lvl
    ));
  };

  const renderScreen = () => {
      switch (currentScreen) {
          case AppScreen.HOME:
              return (
                  <div className="flex-1 flex flex-col items-center justify-center bg-hk-dark p-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                      <div className="z-10 text-center max-w-2xl">
                          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-hk-neon-blue to-hk-neon-pink mb-4 tracking-tighter drop-shadow-lg">
                              CodeHero HK
                          </h1>
                          <p className="text-xl text-slate-300 mb-12 font-mono">
                              專為香港學生打造的 Python 冒險之旅
                          </p>
                          
                          <div className="flex flex-col md:flex-row gap-6 justify-center">
                              <button 
                                onClick={handleStartLogin}
                                className="px-8 py-4 bg-hk-neon-blue text-black font-bold text-lg rounded shadow-[0_0_20px_#00f0ff88] hover:scale-105 transition-transform"
                              >
                                  我是學生 (開始冒險)
                              </button>
                              <button 
                                onClick={() => setCurrentScreen(AppScreen.TEACHER)}
                                className="px-8 py-4 bg-transparent border-2 border-slate-600 text-slate-300 font-bold text-lg rounded hover:border-hk-neon-pink hover:text-hk-neon-pink transition-colors"
                              >
                                  我是老師 (後台管理)
                              </button>
                          </div>
                      </div>
                      <footer className="absolute bottom-4 text-xs text-slate-600 font-mono">
                          v1.3.0 | Made for HK Education
                      </footer>
                  </div>
              );

          case AppScreen.LOGIN:
            return (
              <StudentLogin 
                onLogin={handleLoginSuccess}
                onBack={() => setCurrentScreen(AppScreen.HOME)}
              />
            );
          
          case AppScreen.CHARACTER_SELECT:
            return (
                <CharacterSelection 
                    onSelect={handleCharacterSelected}
                />
            );

          case AppScreen.MAP:
              return (
                  <WorldMap 
                      unlockedLevels={unlockedLevels}
                      onSelectLevel={handleStartGame}
                      onBack={() => setCurrentScreen(AppScreen.HOME)}
                  />
              );

          case AppScreen.GAME:
              const currentLevel = levels.find(l => l.id === selectedLevelId);
              if (!currentLevel) return <div>Level Not Found</div>;

              return (
                  <GameInterface 
                      level={currentLevel} 
                      studentSession={studentSession}
                      onLevelComplete={handleLevelComplete}
                      onBack={() => setCurrentScreen(AppScreen.MAP)}
                  />
              );

          case AppScreen.TEACHER:
              return (
                  <TeacherDashboard 
                      levels={levels}
                      onUpdateLevelTime={handleUpdateLevelTime}
                      onBack={() => setCurrentScreen(AppScreen.HOME)}
                  />
              );
              
          default:
              return <div>Error</div>;
      }
  };

  return (
    <div className="min-h-screen bg-hk-dark text-white flex flex-col font-sans">
      {renderScreen()}
    </div>
  );
};

export default App;

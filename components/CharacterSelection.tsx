
import React, { useState, useEffect } from 'react';
import { CHARACTERS } from '../constants';

interface CharacterSelectionProps {
    onSelect: (characterId: string) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelect }) => {
    const [timeLeft, setTimeLeft] = useState(15);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Timer Logic
    useEffect(() => {
        if (timeLeft > 0 && !selectedId) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !selectedId) {
            // Auto select Pikachu (first character)
            handleSelect(CHARACTERS[0].id);
        }
    }, [timeLeft, selectedId]);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        // Add a small delay for visual feedback before navigating
        setTimeout(() => {
            onSelect(id);
        }, 500);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-hk-dark p-8 relative overflow-hidden font-sans">
             {/* Background */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=2076')] bg-cover bg-center opacity-20 filter blur-sm"></div>
             
             <div className="z-10 w-full max-w-6xl text-center">
                <h2 className="text-4xl font-black text-white mb-2 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
                    選擇你的英雄 (Choose Your Hero)
                </h2>
                <div className="text-2xl font-mono text-hk-neon-pink mb-12 animate-pulse font-bold">
                    {timeLeft > 0 ? `剩餘時間: ${timeLeft}s` : "時間到！自動選擇中..."}
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {CHARACTERS.map((char) => (
                        <button
                            key={char.id}
                            onClick={() => handleSelect(char.id)}
                            className={`
                                group relative w-64 h-80 rounded-2xl border-4 transition-all duration-300 transform hover:-translate-y-4 overflow-hidden
                                ${selectedId === char.id 
                                    ? 'border-hk-neon-blue bg-hk-neon-blue/20 shadow-[0_0_50px_#00f0ff] scale-105' 
                                    : 'border-slate-700 bg-slate-800/80 hover:border-white hover:shadow-2xl'
                                }
                            `}
                        >
                            {/* Card Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 z-10">
                                <h3 className={`text-2xl font-bold mb-2 transition-colors ${selectedId === char.id ? 'text-hk-neon-blue' : 'text-white group-hover:text-yellow-400'}`}>
                                    {char.name}
                                </h3>
                            </div>

                            {/* Image Container */}
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <img 
                                    src={char.imageUrl} 
                                    alt={char.name}
                                    className={`
                                        w-full h-full object-contain transition-transform duration-500
                                        ${selectedId === char.id ? 'scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]' : 'group-hover:scale-110 grayscale group-hover:grayscale-0'}
                                    `}
                                />
                            </div>

                            {/* Selection Overlay */}
                            {selectedId === char.id && (
                                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                            )}
                        </button>
                    ))}
                </div>
             </div>
        </div>
    );
};

export default CharacterSelection;

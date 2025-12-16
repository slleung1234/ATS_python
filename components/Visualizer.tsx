
import React from 'react';
import { Level, CellType, Position, Direction } from '../types';
import { CHARACTERS } from '../constants';

interface VisualizerProps {
  level: Level;
  heroPosition: Position;
  heroDirection: Direction;
  collectedItems: Position[]; 
  characterId?: string; // Receive selected character
}

const Visualizer: React.FC<VisualizerProps> = ({ level, heroPosition, heroDirection, collectedItems, characterId }) => {
  
  const getCellContent = (x: number, y: number, type: CellType) => {
    // Check if hero is here
    const isHero = heroPosition.x === x && heroPosition.y === y;
    
    // Check if item is collected
    const isCollected = collectedItems.some(p => p.x === x && p.y === y);

    if (isHero) {
        // Find Character config, default to Pikachu if not found
        const character = CHARACTERS.find(c => c.id === characterId) || CHARACTERS[0];
        const imageUrl = character.imageUrl;
        
        const isFacingRight = heroDirection === Direction.RIGHT;
        
        return (
            <div className={`relative w-full h-full flex items-center justify-center transition-transform duration-300 z-20`}>
                 <img 
                    src={imageUrl}
                    alt={character.name}
                    className="w-[90%] h-[90%] object-contain drop-shadow-[0_0_15px_rgba(255,255,0,0.6)]"
                    style={{ 
                        transform: isFacingRight ? 'scaleX(-1)' : 'scaleX(1)',
                        transition: 'transform 0.2s ease-in-out',
                        // Optional adjustment for images that might need scaling
                        scale: character.scale || 1 
                    }}
                 />
            </div>
        );
    }

    if (type === CellType.WALL) {
        return <div className="w-full h-full bg-slate-700 border border-slate-600 shadow-inner"></div>;
    }

    if (type === CellType.GOAL) {
        return (
            <div className="w-full h-full bg-green-900/50 flex items-center justify-center border border-green-500/50">
                <div className="w-3/3 h-3/3 bg-green-500 rounded-sm animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            </div>
        );
    }

    if (type === CellType.COIN && !isCollected) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                 {/* Egg Tart visual */}
                <div className="w-3/4 h-3/4 bg-yellow-400 rounded-full border-4 border-yellow-600 shadow-lg animate-bounce"></div>
            </div>
        );
    }

    if (type === CellType.OBSTACLE) {
       return (
            <div className="w-full h-full flex items-center justify-center bg-red-900/20">
                <div className="text-2xl">🚕</div>
            </div>
       );
    }

    // Floor
    return <div className="w-full h-full border border-white/5"></div>;
  };

  return (
    <div className="aspect-square w-full max-w-[500px] bg-hk-panel border-2 border-slate-700 rounded-lg overflow-hidden shadow-2xl relative">
      <div 
        className="grid w-full h-full"
        style={{
            gridTemplateColumns: `repeat(${level.gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${level.gridSize}, 1fr)`
        }}
      >
        {level.layout.map((row, y) => (
            row.map((cellType, x) => (
                <div key={`${x}-${y}`} className="relative">
                    {getCellContent(x, y, cellType)}
                </div>
            ))
        ))}
      </div>
    </div>
  );
};

export default Visualizer;

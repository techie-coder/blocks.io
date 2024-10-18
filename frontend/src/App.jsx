import React, { useState } from 'react';
import Grid from './components/grid';
import Terminal from './components/terminal';
import './App.css';

const App = () => {
  const gridLength = 5;
  const gridBreadth = 20;
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = (direction) => {
    let newX = position.x;
    let newY = position.y;

    switch (direction) {
      case 'up':
        newY = Math.max(position.y - 1, 0);
        break;
      case 'down':
        newY = Math.min(position.y + 1, gridSize - 1);
        break;
      case 'left':
        newX = Math.max(position.x - 1, 0);
        break;
      case 'right':
        newX = Math.min(position.x + 1, gridSize - 1);
        break;
      default:
        return null; // Invalid command
    }

    setPosition({ x: newX, y: newY });
    return `(${newX}, ${newY})`; // Return the updated position
  };

  return (
    <div className="game-container">
      <Grid gridLength={gridLength} gridBreadth={gridBreadth} position={position} />
      <Terminal handleMove={handleMove} />
    </div>
  );
};

export default App
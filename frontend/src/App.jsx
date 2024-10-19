import React, { useState } from 'react';
import Grid from './components/grid/grid';
import Terminal from './components/terminal/terminal';
import { generateObstacles, isObstacle } from './components/obstacles';
import './App.css';

const App = () => {
  const gridLength = 9;
  const gridBreadth = 27;
  const [position, setPosition] = useState({ x: 10, y: 3 });

  // Generate obstacles
  const obstacles = generateObstacles();

  const handleMove = (direction) => {
    let newX = position.x;
    let newY = position.y;

    switch (direction) {
      case 'up':
        newY = Math.max(position.y - 1, 0);
        break;
      case 'down':
        newY = Math.min(position.y + 1, gridLength-1);
        break;
      case 'left':
        newX = Math.max(position.x - 1, 0);
        break;
      case 'right':
        newX = Math.min(position.x + 1, gridBreadth-1);
        break;
      default:
        return null; // Invalid command
    }

    if (isObstacle(newX, newY, obstacles)) {
      return `Obstacle at (${newX}, ${newY}), can't move there!`;
    }

    setPosition({ x: newX, y: newY });
    return `(${newX}, ${newY})`; // Return the updated position
  }

  return (
    <div className="game-container">
      <Grid numCols={gridLength} numRows={gridBreadth} position={position} obstacles={obstacles} />
      <Terminal handleMove={handleMove} />
    </div>
  )
};

export default App
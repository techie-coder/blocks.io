import React from 'react';
import './grid.css'; // Optional: Create a separate CSS file for Grid

const Grid = ({ numRows, numCols, position }) => {
  return (
    <div className="grid">
      {Array.from({ length: numCols }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {Array.from({ length: numRows }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={`grid-cell ${
                position.x === colIndex && position.y === rowIndex ? 'active-block' : ''
              }`}
            >
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;

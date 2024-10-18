import React from 'react';
import './grid.css'; // Optional: Create a separate CSS file for Grid

const Grid = ({ gridLength, gridBreadth, position })=>{
    return(
    <>
        <div className="grid">
        {/* Create the grid */}
        {Array.from({ length: gridLength }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid-row">
            {Array.from({ length: gridBreadth }).map((_, colIndex) => (
                <div
                key={colIndex}
                className={`grid-cell ${
                    position.x === colIndex && position.y === rowIndex ? "active-block" : ""
                }`}
                ></div>
            ))}
            </div>
        ))}
        </div>
      </>
    )
}

export default Grid;
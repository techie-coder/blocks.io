import React, { useState } from 'react';
import './terminal.css'

const Terminal = ({ handleMove })=>{
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState('');


    // Handle terminal input
    const handleCommandSubmit = (e) => {
      e.preventDefault();
      result = handleMove(command.toLowerCase().trim());

      if (result) {
        setOutput(`Moved ${direction}. Current position: ${result}`);
      } else {
        setOutput('Invalid command. Use: up, down, left, right.');
      }
      setCommand('');
    };

    return (
        <>
            {/* GUI terminal for user input */}
            <div className="terminal">
                <form onSubmit={handleCommandSubmit}>
                <input
                    type="text"
                    placeholder="Enter command (up, down, left, right)"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                />
                <button type="submit">Execute</button>
                </form>
                <div className="terminal-output">
                {output}
                </div>
            </div>
        </>
    )
}

export default Terminal;
import React, { useEffect, useRef, useState } from 'react';
import './terminal.css'

const Terminal = ({ handleMove })=>{
    const [command, setInput] = useState('');
    const [output, setOutput] = useState('');
    const outputRef = useRef(null);

    useEffect(()=>{
      if (outputRef.current){
        outputRef.current.scrollTop = outputRef.current.scrollHeight
      }
    }, [output])

    // Handle terminal input
    const handleCommandSubmit = () => {
      const trimmedCommand = command.trim().toLowerCase();

      if (trimmedCommand) {
        let newOutput = `$ ${trimmedCommand}`;
        
        if (trimmedCommand === 'clear'){
          setOutput(' ');
          setInput(' ');
          return;
        }

        // Handle commands
        const result = handleMove(trimmedCommand);
        if (result) {
          newOutput += `\nMoved ${trimmedCommand}. Current position: ${result}\n`;
        } else {
          newOutput += `\nInvalid command. Try: up, down, left, right.\n`;
        }

        // Append to output and clear input
        setOutput((prevOutput) => [...prevOutput, newOutput]);
        setInput(''); // Clear input field
      }
    }

    return (
        <>
            {/* GUI terminal for user input */}
            <div className="terminal-window">
              <div className="terminal-output">
                <pre>{output}</pre>
              </div>
              <div className="terminal-input">
              <span className="terminal-prompt">player@blocks.io:~$</span>
                <input
                    type="text"
                    value={command}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter"){
                        e.preventDefault()
                        handleCommandSubmit()
                      }
                    }}
                    autoFocus
                  />
              </div>
            </div>
        </>
    )
}

export default Terminal;
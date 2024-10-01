import { useEffect, useRef, useState } from 'react';
import useHttp from '../../../../hooks/use-http';
import './TerminalComponent.scss';
import { ButtonGroup } from 'react-bootstrap';

function TerminalComponent() {
  const outputRef = useRef<HTMLPreElement | null>(null);
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState("");
  const { executeSql } = useHttp();

  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  const handleExecute = async () => {
    try {
      const result = await executeSql(query);
      setOutput(prevOutput => prevOutput + "\n" + query + "\n" + JSON.stringify(result.data.rows, null, 2) + "\n\n");
    } catch (error) {
      if (error instanceof Error) {
        setOutput(prevOut => prevOut + "\n\nError: " + error.message);
      } else {
        setOutput(prevOut => prevOut + "\n\nError: " + error);
      }
    }

    setQuery("");
  };

  const handleHelp = async () => {
    window.open("https://docs.corelightning.org/reference/lightning-sql", "_blank");
  };

  const handleClear = () => {
    setOutput("");
  }

  useEffect(() => {
    scrollToBottom();
  }, [output]);

  return (
    <div className='terminal-container max-w-4xl mx-auto overflow-auto'>
      <pre className='terminal-output overflow-auto whitespace-pre-wrap' ref={outputRef}>
        {output}
      </pre>
      <input name='query'
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Enter SQL query..."
        className='terminal-input mb-2' />
      <ButtonGroup className="sticky-bottom btn-group-action">
        <button className="btn-actions btn-primary execute-button" onClick={handleExecute}>
          Execute
        </button>
        <button className="btn-actions btn-primary" onClick={handleHelp}>
          Help
        </button>
        <button className="btn-actions btn-primary" onClick={handleClear}>
          Clear
        </button>
      </ButtonGroup>
    </div>
  )
};

export default TerminalComponent;

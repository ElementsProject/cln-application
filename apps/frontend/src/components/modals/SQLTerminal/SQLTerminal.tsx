import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonGroup, Form, InputGroup, Modal } from 'react-bootstrap';
import './SQLTerminal.scss';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CloseSVG } from '../../../svgs/Close';
import logger from '../../../services/logger.service';
import { SQLSVG } from '../../../svgs/SQL';
import { CopySVG } from '../../../svgs/Copy';
import { copyTextToClipboard } from '../../../utilities/data-formatters';
import { RootService } from '../../../services/http.service';
import { setShowModals, setShowToast } from '../../../store/rootSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectShowModals } from '../../../store/rootSelectors';

const SQLTerminal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const showModals = useSelector(selectShowModals);
  const dispatch = useDispatch();
  const outputRef = useRef<HTMLPreElement | null>(null);
  const [executed, setExecuted] = useState(false);
  const [query, setQuery] = useState('');
  const [output, setOutput] = useState('');

  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  const handleChange = e => {
    setExecuted(false);
    setQuery(e.target.value);
  };

  const handleCopy = e => {
    let textToCopy = '';
    if (e.target.id === 'SQL Query') {
      textToCopy = query;
    } else if (outputRef.current) {
      textToCopy = outputRef.current.innerText;
    }
    copyTextToClipboard(textToCopy)
      .then(() => {
        dispatch(setShowToast({
          show: true,
          message: e.target.id + ' Copied Successfully!',
          bg: 'success',
        }));
      })
      .catch(err => {
        logger.error(err);
      });
  };

  const handleExecute = useCallback(async () => {
    const formattedQuery = query.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    try {
      const result = await RootService.executeSql(formattedQuery);
      setOutput(JSON.stringify(result.rows, null, 2) + '\n\n');
      setOutput(formattedQuery + '\n' + JSON.stringify(result.rows, null, 2) + '\n\n');
    } catch (error: any) {
      if (error && error.message) {
        setOutput(formattedQuery + '\nError: ' + error.message);
      } else {
        setOutput(formattedQuery + '\nError: ' + error);
      }
    }
  }, [query]);

  const handleHelp = async () => {
    window.open('https://docs.corelightning.org/reference/sql', '_blank');
  };

  const handleClear = () => {
    setQuery('');
    setOutput('');
  };

  useEffect(() => {
    // Check if the last character is a newline and the character before it is a semicolon
    if (!executed && query.endsWith('\n') && query.trimEnd().endsWith(';')) {
      setExecuted(true);
      handleExecute();
    }
  }, [query, executed, handleExecute]);

  useEffect(() => {
    scrollToBottom();
  }, [output]);

  const closeHandler = () => {
    dispatch(setShowModals({ ...showModals, sqlTerminalModal: false }));
  }

  return (
    <Modal ref={containerRef} show={showModals.sqlTerminalModal} onHide={closeHandler} centered className='modal-xl' data-testid='sql-terminal'>
      <Modal.Header className='d-flex align-items-start justify-content-between pb-0 mx-2'>
        <h4>SQL Terminal</h4>
        <span className='span-close-svg' onClick={closeHandler}><CloseSVG /></span>
      </Modal.Header>
      <Modal.Body className='py-0 px-4'>
        <div data-testid='terminal-container'>
          <InputGroup className='d-flex align-items-stretch justify-content-start mb-4'>
            <InputGroup.Text className='align-items-start form-control-addon form-control-addon-left pt-3'>
              <SQLSVG />
            </InputGroup.Text>
            <Form.Control
              tabIndex={1}
              autoFocus={true}
              id='query'
              name='query'
              data-testid='query-input'
              type='text'
              placeholder='SQL Query'
              aria-label='query'
              aria-describedby='addon-query'
              className='form-control-middle terminal-input ps-1 pt-3'
              as='textarea'
              rows={5}
              value={query}
              onChange={handleChange}
            />
            <InputGroup.Text
              id={query}
              className='form-control-addon form-control-addon-right align-items-start pt-3'
              onClick={handleCopy}
            >
              <CopySVG id='SQL Query' showTooltip={true} />
            </InputGroup.Text>
          </InputGroup>
          <div style={{ position: 'relative' }}>
            <button tabIndex={3} onClick={handleCopy} className='btn-copy-output'>
              <CopySVG id='Output' showTooltip={true} />
            </button>
            <pre
              className={
                'terminal-output ' + (output.includes('Error: ') ? 'text-invalid' : 'text-valid')
              }
              ref={outputRef}
            >
              <PerfectScrollbar>
                <code>{output}</code>
              </PerfectScrollbar>
            </pre>
          </div>
          <ButtonGroup className='btn-group-action mb-3'>
            <button
              tabIndex={4}
              type='button'
              className='btn-rounded bg-primary fs-6 me-4'
              onClick={handleExecute}
            >
              Execute
            </button>
            <button
              tabIndex={5}
              type='button'
              className='btn-rounded bg-primary fs-6 me-4'
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              tabIndex={6}
              type='button'
              className='btn-rounded bg-primary fs-6 me-4'
              onClick={handleHelp}
            >
              Help
            </button>
          </ButtonGroup>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SQLTerminal;

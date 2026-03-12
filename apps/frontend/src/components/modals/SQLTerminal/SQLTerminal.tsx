import './SQLTerminal.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonGroup, Form, InputGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faTable } from '@fortawesome/free-solid-svg-icons';
import { CloseSVG } from '../../../svgs/Close';
import logger from '../../../services/logger.service';
import { SQLSVG } from '../../../svgs/SQL';
import { CopySVG } from '../../../svgs/Copy';
import { copyTextToClipboard, titleCase } from '../../../utilities/data-formatters';
import { RootService } from '../../../services/http.service';
import { setShowModals, setShowToast } from '../../../store/rootSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectShowModals } from '../../../store/rootSelectors';
import ToggleSwitch from '../../shared/ToggleSwitch/ToggleSwitch';
import { TRANSITION_DURATION } from '../../../utilities/constants';

const parseTableName = (sql: string): string | null => {
  const match = sql.replace(/\s+/g, ' ').trim().match(/\bFROM\s+([`"\[]?[\w]+[`"\]]?)/i);
  if (!match) return null;
  return match[1].replace(/[`"[\]]/g, '');
};

const parseColumnNames = (sql: string): string[] | null => {
  const trimmed = sql.replace(/\s+/g, ' ').trim();
  const match = trimmed.match(/^SELECT\s+([\s\S]+?)\s+FROM\s+/i);
  if (!match) return null;

  const colsPart = match[1].trim();
  if (colsPart === '*') return null;

  const cols: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of colsPart) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ',' && depth === 0) {
      cols.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) cols.push(current.trim());

  return cols.map(col => {
    const asMatch = col.match(/\bAS\s+([`"\[]?[\w]+[`"\]]?)\s*$/i);
    if (asMatch) return asMatch[1].replace(/[`"[\]]/g, '');
    const tokens = col.split(/\s+/);
    const last = tokens[tokens.length - 1].replace(/[`"[\]]/g, '');
    if (/^[\w]+$/.test(last)) return last;
    return col;
  });
};

type ViewMode = 'Table' | 'JSON';

type OutputState =
  | { type: 'empty' }
  | { type: 'error'; message: string }
  | { type: 'result'; columns: string[] | null; rows: any[][] };

const SQLTerminal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const showModals = useSelector(selectShowModals);
  const dispatch = useDispatch();
  const outputRef = useRef<HTMLDivElement | null>(null);
  const [executed, setExecuted] = useState(false);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('Table');
  const [direction, setDirection] = useState(-1);
  const [outputState, setOutputState] = useState<OutputState>({ type: 'empty' });

  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  const handleChange = e => {
    setExecuted(false);
    setQuery(e.target.value);
  };

  const handleCopy = (e) => {
    const id = e.target.id;

    const textToCopy = 
      id === 'SQL Query' ? query
      : id === 'Table Output' && outputState.type === 'error' ? outputState.message
      : id === 'Table Output' && outputState.type === 'result' ? JSON.stringify([outputState.columns, ...outputState.rows], null, 2)
      : outputRef.current?.innerText || '';

    copyTextToClipboard(textToCopy)
      .then(() => dispatch(setShowToast({ show: true, message: `${id} Copied Successfully!`, bg: 'success' })))
      .catch(err => logger.error(err));
  };

  const handleExecute = useCallback(async () => {
    const formattedQuery = query.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    try {
      const result: any = await RootService.executeSql(formattedQuery);
      const rows: any[][] = result.rows;

      if (!Array.isArray(rows) || rows.length === 0) {
        setOutputState({ type: 'result', columns: null, rows: [] });
        return;
      }

      let columns = parseColumnNames(formattedQuery);

      if (!columns) {
        const tableName = parseTableName(formattedQuery);
        if (tableName) {
          try {
            const schema: any = await RootService.listSqlSchemas(tableName);
            const tableSchema = schema?.schemas?.[0];
            if (tableSchema?.columns && Array.isArray(tableSchema.columns)) {
              columns = tableSchema.columns.map((col: any) => col.name ?? String(col));
            }
          } catch (schemaError: any) {
            logger.error('Failed to fetch SQL schema for table: ' + tableName, schemaError);
          }
        }
      }
      setOutputState({ type: 'result', columns, rows });
    } catch (error: any) {
      setOutputState({
        type: 'error',
        message: error?.message ? error.message : String(error),
      });
    }
  }, [query]);

  const handleHelp = async () => {
    window.open('https://docs.corelightning.org/reference/sql', '_blank');
  };

  const handleClear = () => {
    setQuery('');
    setOutputState({ type: 'empty' });
    setViewMode('Table');
  };

  const handleViewModeChange = (changedIndex: number) => {
    const next: ViewMode = changedIndex === 0 ? 'Table' : 'JSON';
    setDirection(next === 'Table' ? -1 : 1);
    setViewMode(next);
  };

  useEffect(() => {
    if (!executed && query.endsWith('\n') && query.trimEnd().endsWith(';')) {
      setExecuted(true);
      handleExecute();
    }
  }, [query, executed, handleExecute]);

  useEffect(() => {
    scrollToBottom();
  }, [outputState]);

  const closeHandler = () => {
    handleClear();
    dispatch(setShowModals({ ...showModals, sqlTerminalModal: false }));
  };

  const getHeaders = (columns: string[] | null, firstRow: any[]): string[] => {
    if (columns && columns.length === firstRow.length) return columns;
    return firstRow.map((_, i) => `Col ${i}`);
  };

  const renderOutput = () => {
    switch (outputState.type) {
      case 'empty':
        return (
          <div className='terminal-output text-muted'>
            <span>Results will appear here…</span>
          </div>
        );

      case 'error':
        return (
          <pre className='terminal-output text-invalid'>
            <code>Error: {outputState.message}</code>
          </pre>
        );

      case 'result': {
        const { columns, rows } = outputState;

        if (rows.length === 0) {
          return (
            <div className='terminal-output text-muted'>
              <span>Query returned no rows.</span>
            </div>
          );
        }
        let headers;
        if (viewMode === 'Table') {
          headers = getHeaders(columns, rows[0]);
        }

        return (
          <AnimatePresence mode='wait'>
            <motion.div
              key={viewMode}
              initial={{ x: 20 * direction, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20 * direction, opacity: 0 }}
              transition={{ duration: TRANSITION_DURATION }}
            >
              {viewMode === 'Table' ? (
                <div className='terminal-output terminal-table-wrapper' ref={outputRef}>
                  <div className='terminal-table-header'>
                    <div className='text-muted'>
                      {rows.length} row{rows.length !== 1 ? 's' : ''}
                    </div>
                    <button tabIndex={3} onClick={handleCopy} className='btn-copy-output'>
                      <CopySVG id='Table Output' showTooltip={true} />
                    </button>
                  </div>
                  <PerfectScrollbar options={{ suppressScrollX: false }}>
                    <div className='div-sql-result'>
                      <table className='sql-table mt-1'>
                        <thead className='sql-table-head'>
                          <tr className='sql-table-header-row'>
                            {headers.map((h, i) => (
                              <th key={i}>{titleCase(h.replaceAll('_', ' '))}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className='sql-table-body'>
                          {rows.map((row, ri) => (
                            <tr key={ri} className='sql-table-row'>
                              {(Array.isArray(row) ? row : [row]).map((cell, ci) => (
                                <td key={ci}>
                                  {cell === null || cell === undefined
                                    ? <span className='text-muted'>null</span>
                                    : String(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </PerfectScrollbar>
                </div>
              ) : (
                <div className='terminal-output p-0'>
                  <div className='terminal-json-header border-bottom'>
                    <div className='text-muted'>
                      {rows.length} record{rows.length !== 1 ? 's' : ''}
                    </div>
                    <button tabIndex={3} onClick={handleCopy} className='btn-copy-output'>
                      <CopySVG id='JSON Output' showTooltip={true} />
                    </button>
                  </div>
                  <pre className='terminal-output-scroll-container ps-3' ref={outputRef as any}>
                    <PerfectScrollbar>
                      <code>{JSON.stringify(rows, null, 2)}</code>
                    </PerfectScrollbar>
                  </pre>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        );
      }
    }
  };

  return (
    <Modal ref={containerRef} show={showModals.sqlTerminalModal} onHide={closeHandler} centered className='modal-xl' data-testid='sql-terminal'>
      <Modal.Header className='d-flex align-items-start justify-content-between pb-0 mx-2 border-0'>
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
          <div className='d-flex justify-content-end'>
            <ToggleSwitch
              className='mb-4'
              disabled={outputState.type !== 'result'}
              onChange={handleViewModeChange}
              values={[
                <OverlayTrigger key='tb' placement='top' overlay={<Tooltip>Table View</Tooltip>}>
                  <span><FontAwesomeIcon className='ms-2' icon={faTable} /></span>
                </OverlayTrigger>,
                <OverlayTrigger key='rw' placement='top' overlay={<Tooltip>JSON View</Tooltip>}>
                  <span><FontAwesomeIcon className='me-1' icon={faCode} /></span>
                </OverlayTrigger>,
              ]}
              selIndex={viewMode === 'Table' ? 0 : 1}
            />
          </div>
          <div className='terminal-output-container'>
            {renderOutput()}
          </div>
          <ButtonGroup className='btn-group-action mb-3'>
            <button tabIndex={4} type='button' className='btn-rounded bg-primary fs-6 me-4' onClick={handleExecute}>
              Execute
            </button>
            <button tabIndex={5} type='button' className='btn-rounded bg-primary fs-6 me-4' onClick={handleClear}>
              Clear
            </button>
            <button tabIndex={6} type='button' className='btn-rounded bg-primary fs-6 me-4' onClick={handleHelp}>
              Help
            </button>
          </ButtonGroup>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SQLTerminal;

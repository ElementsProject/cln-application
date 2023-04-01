import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip';

export const CopySVG = props => {
  return (
    <OverlayTrigger
    placement='auto'
    delay={{ show: 250, hide: 250 }}
    overlay={(props.showTooltip ? <Tooltip>{'Copy ' + (props.id || '')}</Tooltip> : <></>)}
    >
      <svg id={props.id} className={props.className} width='22' height='20' viewBox='0 0 22 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path id={props.id} className='stroke-light' d='M15.3164 6.4375H17.3789C17.7931 6.4375 18.1289 6.77329 18.1289 7.1875V17.6875C18.1289 18.1017 17.7931 18.4375 17.3789 18.4375H6.87891C6.46469 18.4375 6.12891 18.1017 6.12891 17.6875V15.625' strokeWidth='1.3' strokeLinecap='round' strokeLinejoin='round'/>
        <path id={props.id} className='stroke-light' d='M1.25391 2.3125C1.25391 1.89828 1.5897 1.5625 2.00391 1.5625H12.5039C12.9181 1.5625 13.2539 1.89829 13.2539 2.3125V12.8125C13.2539 13.2267 12.9181 13.5625 12.5039 13.5625H2.00391C1.58969 13.5625 1.25391 13.2267 1.25391 12.8125V2.3125Z' strokeWidth='1.3' strokeLinejoin='round'/>
      </svg>
    </OverlayTrigger>
  );
};


import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip';
import { titleCase } from '../utilities/data-formatters';

export const OutgoingArrowSVG = props => {
  return (
    <OverlayTrigger
      placement='auto'
      delay={{ show: 250, hide: 250 }}
      overlay={(props.txStatus === 'withdrawal') ? <></> : <Tooltip>{props.txStatus === 'complete' ? 'Paid' : titleCase(props.txStatus)}</Tooltip>}
      >
      <svg
        className={props.className}
        width='42'
        height='42'
        viewBox='0 0 42 42'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle cx='21' cy='21' r='21' className='fill-body-bg' />
        <path
          d='M13.3891 30L12 28.6109L25.6265 14.9844H13.1245V13H29V28.8755H27.0156V16.3735L13.3891 30Z'
          className={(props.txStatus === 'withdrawal' || props.txStatus === 'complete') ? 'fill-warning' : 'fill-light'}
        />
      </svg>
    </OverlayTrigger>
  );
};

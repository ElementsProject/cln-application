import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip';
import { titleCase } from '../utilities/data-formatters';

export const IncomingArrowSVG = props => {
  return (
    <OverlayTrigger
      placement='auto'
      delay={{ show: 250, hide: 250 }}
      overlay={(props.txStatus === 'used' || props.txStatus === 'unused') ? <Tooltip>{titleCase(props.txStatus)}</Tooltip> : (props.txStatus === 'deposit') ? <></> : <Tooltip>{props.txStatus === 'paid' ? 'Received' : titleCase(props.txStatus)}</Tooltip>}
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
          d='M13.3891 13L12 14.3891L25.6265 28.0156H13.1245V30H29V14.1245H27.0156V26.6265L13.3891 13Z'
          className={(props.txStatus === 'deposit' || props.txStatus === 'paid') ? 'fill-success' : 'fill-light'}
        />
      </svg>
    </OverlayTrigger>
  );
};

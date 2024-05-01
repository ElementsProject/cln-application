import React from 'react';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip';

export const AddSVG = props => {
  return (
    <OverlayTrigger
    placement='auto'
    delay={{ show: 250, hide: 250 }}
    overlay={(props.showTooltip ? <Tooltip>{'Copy ' + (props.id || '')}</Tooltip> : <></>)}
    >
      <svg className={props.className} width='22' height='20' viewBox='0 0 22 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path className='stroke-light' d='M11 4V16' strokeWidth='1.3' strokeLinecap='round'/>
        <path className='stroke-light' d='M4 10H18' strokeWidth='1.3' strokeLinecap='round'/>
      </svg>
    </OverlayTrigger>
  );
};


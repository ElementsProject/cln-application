import React from 'react';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip';

export const AddSVG = props => {
  return (
    <OverlayTrigger
      placement='auto'
      delay={{ show: 250, hide: 250 }}
      overlay={(props.showTooltip ? <Tooltip>{props.tooltipText || ''}</Tooltip> : <></>)}
    >
      <svg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M1 8.5H16' stroke='#9F9F9F' strokeWidth='1.3' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M8.5 1V16' stroke='#9F9F9F' strokeWidth='1.3' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    </OverlayTrigger>
  );
};


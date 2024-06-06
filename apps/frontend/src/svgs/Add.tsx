import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export const AddSVG = props => {
  return (
    <OverlayTrigger
    placement='auto'
    delay={{ show: 250, hide: 250 }}
    overlay={(props.showTooltip ? <Tooltip>{props.tooltipText || ''}</Tooltip> : <></>)}
    >
      <svg xmlns='http://www.w3.org/2000/svg' className={props.className} fill='none' viewBox='0 0 24 24' width='18' height='18'>
        <path className='svg-add fill-light' fillRule='evenodd' d='M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z'/>
      </svg>
    </OverlayTrigger>
  );
};


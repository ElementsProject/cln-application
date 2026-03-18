import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export const CloseSVG = props => {
  const svg = (
    <svg
      className={props.className}
      width={props.width || '17'}
      height={props.height || '17'}
      viewBox='0 0 17 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M1 16L16 1'
        strokeWidth='2'
        strokeLinecap='round'
        className='stroke-light'
      />
      <path
        d='M16 16L1 1'
        strokeWidth='2'
        strokeLinecap='round'
        className='stroke-light'
      />
    </svg>
  );

  if (!props.showTooltip) return svg;

  return (
    <OverlayTrigger
      placement='right'
      delay={{ show: 250, hide: 250 }}
      overlay={<Tooltip>{props.tooltipText || 'Clear'}</Tooltip>}
    >
      {svg}
    </OverlayTrigger>
  );
};

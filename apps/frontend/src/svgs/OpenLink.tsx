import React from 'react';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip';

export const OpenLinkSVG = props => {
  return (
    <OverlayTrigger
      placement='auto'
      delay={{ show: 250, hide: 250 }}
      overlay={<Tooltip>{'Open with Blockstream Explorer'}</Tooltip>}
      >
        <svg id={props.id} className={props.className} width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path className='fill-light' fillRule='evenodd' clipRule='evenodd' d='M10.2708 0.708333C10.2708 0.317132 10.588 1.0555e-08 10.9792 1.0555e-08H16.2917C16.6829 1.0555e-08 17 0.317132 17 0.708333V6.02083C17 6.41203 16.6829 6.72917 16.2917 6.72917C15.9005 6.72917 15.5833 6.41203 15.5833 6.02083V1.41667H10.9792C10.588 1.41667 10.2708 1.09953 10.2708 0.708333Z' />
          <path className='fill-light' fillRule='evenodd' clipRule='evenodd' d='M16.7925 0.207466C17.0692 0.484087 17.0692 0.932579 16.7925 1.2092L10.4175 7.5842C10.1409 7.86082 9.69242 7.86082 9.4158 7.5842C9.13918 7.30758 9.13918 6.85909 9.4158 6.58247L15.7908 0.207466C16.0674 -0.0691554 16.5159 -0.0691554 16.7925 0.207466Z' />
          <path className='fill-light' fillRule='evenodd' clipRule='evenodd' d='M0.414932 3.24827C0.680608 2.98259 1.04094 2.83333 1.41667 2.83333H7.08333C7.47453 2.83333 7.79167 3.15046 7.79167 3.54167C7.79167 3.93287 7.47453 4.25 7.08333 4.25H1.41667L1.41667 15.5833H12.75V9.91667C12.75 9.52546 13.0671 9.20833 13.4583 9.20833C13.8495 9.20833 14.1667 9.52546 14.1667 9.91667V15.5833C14.1667 15.9591 14.0174 16.3194 13.7517 16.5851C13.4861 16.8507 13.1257 17 12.75 17H1.41667C1.04094 17 0.68061 16.8507 0.414932 16.5851C0.149256 16.3194 0 15.9591 0 15.5833V4.25C0 3.87428 0.149256 3.51394 0.414932 3.24827Z'/>
        </svg>
    </OverlayTrigger>
  );
};

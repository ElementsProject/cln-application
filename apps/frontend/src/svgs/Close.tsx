import React from 'react';

export const CloseSVG = props => {
  return (
    <svg
      className={props.className}
      width='17'
      height='17'
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
};

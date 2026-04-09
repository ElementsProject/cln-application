import React from 'react';

export const FactorySVG = props => {
  return (
    <svg
      className={props.className}
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2 20V9l4-5v4l4-4v4l4-4v10h8V8h-6V4h8v16H2Zm2-2h16V12H14v-1.6l-4 4V12.8l-4 4V12.8L4 15.6V18Zm2-2h2v-2H8v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Z'
        className='fill-contrast'
      />
    </svg>
  );
};

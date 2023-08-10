import React from 'react';

export const DescriptionSVG = props => {
  return (
    <svg
      className={props.className}
      width='16'
      height='12'
      viewBox='0 0 16 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M4.0625 9.375C4.58027 9.375 5 8.9553 5 8.4375C5 7.9197 4.58027 7.5 4.0625 7.5C3.54473 7.5 3.125 7.9197 3.125 8.4375C3.125 8.9553 3.54473 9.375 4.0625 9.375Z'
        className='fill-body-color'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2 0C1.17157 0 0.5 0.671572 0.5 1.5V10.5C0.5 11.3285 1.17157 12 2 12H14C14.8284 12 15.5 11.3285 15.5 10.5V1.5C15.5 0.671572 14.8284 0 14 0H2ZM14.375 1.5C14.375 1.2929 14.2071 1.125 14 1.125H2C1.7929 1.125 1.625 1.2929 1.625 1.5V3.75H14.375V1.5ZM14.375 4.875H1.625V10.5C1.625 10.7071 1.7929 10.875 2 10.875H14C14.2071 10.875 14.375 10.7071 14.375 10.5V4.875Z'
        className='fill-body-color'
      />
    </svg>
  );
};

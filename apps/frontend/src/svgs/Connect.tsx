import React from 'react';

export const ConnectSVG = props => {
  return (
    <svg
      fill='#3a4247'
      width='20'
      height='20'
      viewBox='0 0 64 64'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      {/* Left node */}
      <circle cx='14' cy='32' r='12' />
      {/* Connector bar */}
      <rect x='26' y='29' width='12' height='6' rx='3' />
      {/* Right node */}
      <circle cx='50' cy='32' r='12' />
      {/* Plus icon cut from right node */}
      <rect x='46' y='30' width='8' height='4' rx='1' fill='white' />
      <rect x='48' y='28' width='4' height='8' rx='1' fill='white' />
    </svg>
  );
};

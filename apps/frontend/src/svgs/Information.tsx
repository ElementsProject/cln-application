import React from 'react';

import { forwardRef } from "react";

export const InformationSVG = props => {
  return (
    <svg
      className={props.svgClassName}
      width='17'
      height='17'
      viewBox='0 0 17 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.125 1.25C4.32804 1.25 1.25 4.32804 1.25 8.125C1.25 11.922 4.32804 15 8.125 15C11.922 15 15 11.922 15 8.125C15 4.32804 11.922 1.25 8.125 1.25ZM0 8.125C0 3.63769 3.63769 0 8.125 0C12.6123 0 16.25 3.63769 16.25 8.125C16.25 12.6123 12.6123 16.25 8.125 16.25C3.63769 16.25 0 12.6123 0 8.125Z'
        className={props.className}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6.875 7.5C6.875 7.15482 7.15482 6.875 7.5 6.875H8.125C8.47018 6.875 8.75 7.15482 8.75 7.5V11.25C9.09518 11.25 9.375 11.5298 9.375 11.875C9.375 12.2202 9.09518 12.5 8.75 12.5H8.125C7.77982 12.5 7.5 12.2202 7.5 11.875V8.125C7.15482 8.125 6.875 7.84518 6.875 7.5Z'
        className={props.className}
      />
      <path
        d='M7.96875 5.625C8.48652 5.625 8.90625 5.20527 8.90625 4.6875C8.90625 4.16973 8.48652 3.75 7.96875 3.75C7.45098 3.75 7.03125 4.16973 7.03125 4.6875C7.03125 5.20527 7.45098 5.625 7.96875 5.625Z'
        className={props.className}
      />
    </svg>
  );
};

export const InformationSVGRef = forwardRef((props: any, ref: any) => 
  (
    <svg
      ref={ref}
      className={props.svgClassName}
      width='17'
      height='17'
      viewBox='0 0 17 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.125 1.25C4.32804 1.25 1.25 4.32804 1.25 8.125C1.25 11.922 4.32804 15 8.125 15C11.922 15 15 11.922 15 8.125C15 4.32804 11.922 1.25 8.125 1.25ZM0 8.125C0 3.63769 3.63769 0 8.125 0C12.6123 0 16.25 3.63769 16.25 8.125C16.25 12.6123 12.6123 16.25 8.125 16.25C3.63769 16.25 0 12.6123 0 8.125Z'
        className={props.className}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6.875 7.5C6.875 7.15482 7.15482 6.875 7.5 6.875H8.125C8.47018 6.875 8.75 7.15482 8.75 7.5V11.25C9.09518 11.25 9.375 11.5298 9.375 11.875C9.375 12.2202 9.09518 12.5 8.75 12.5H8.125C7.77982 12.5 7.5 12.2202 7.5 11.875V8.125C7.15482 8.125 6.875 7.84518 6.875 7.5Z'
        className={props.className}
      />
      <path
        d='M7.96875 5.625C8.48652 5.625 8.90625 5.20527 8.90625 4.6875C8.90625 4.16973 8.48652 3.75 7.96875 3.75C7.45098 3.75 7.03125 4.16973 7.03125 4.6875C7.03125 5.20527 7.45098 5.625 7.96875 5.625Z'
        className={props.className}
      />
    </svg>
  )
);

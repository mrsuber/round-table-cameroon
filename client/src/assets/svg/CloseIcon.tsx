import React from 'react';
import { svgProps } from './svgProps';

const CloseIcon = ({ size = '12', color = '#828282', onClick, style }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 12 12'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{ ...style, cursor: 'pointer' }}
    onClick={onClick}
  >
    <path
      d='M10.375 1.625L1.625 10.375M10.375 10.375L1.625 1.625L10.375 10.375Z'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default CloseIcon;

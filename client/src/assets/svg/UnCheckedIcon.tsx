import React from 'react';
import { svgProps } from './svgProps';

const UnCheckedIcon = ({ size = '24', color = '#B0E4DD', borderColor, style }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{ cursor: 'pointer', border: `1px solid ${borderColor}`, borderRadius: '50%', ...style }}
  >
    <circle cx='12' cy='12' r='12' fill={color} />
  </svg>
);

export default UnCheckedIcon;

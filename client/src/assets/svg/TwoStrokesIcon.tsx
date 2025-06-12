import React from 'react';
import { svgProps } from './svgProps';

const TwoStrokesIcon = ({
  color = '#FFBE5C',
  width = '12',
  height = '6',
  className,
  ...props
}: svgProps) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 16 8'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <rect x='0.5' y='0.666504' width='15' height='1.66667' rx='0.833333' fill={color} />
    <rect x='0.5' y='5.6665' width='15' height='1.66667' rx='0.833333' fill={color} />
  </svg>
);

export default TwoStrokesIcon;

import React from 'react';
import { svgProps } from './svgProps';

const IncDecIcon = ({ size = '8', color = '#005259', style }: svgProps) => (
  <svg
    width={size}
    height={String(Number(size) * 2)}
    viewBox='0 0 11 21'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={style}
  >
    <path
      d='M0.925178 12.188H10.0748C10.8975 12.188 11.3089 13.5543 10.7284 14.3508L6.15355 20.6281C5.79217 21.124 5.20783 21.124 4.8503 20.6281L0.271632 14.3508C-0.30887 13.5543 0.102479 12.188 0.925178 12.188ZM10.7284 6.64921L6.15355 0.371891C5.79217 -0.123964 5.20783 -0.123964 4.8503 0.371891L0.271632 6.64921C-0.30887 7.44574 0.102479 8.81198 0.925178 8.81198H10.0748C10.8975 8.81198 11.3089 7.44574 10.7284 6.64921Z'
      fill={color}
    />
  </svg>
);

export default IncDecIcon;

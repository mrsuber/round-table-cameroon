import React from 'react';
import { svgProps } from './svgProps';

const TrendTaskIcon = ({ color='#1EA7FF' }: svgProps) => (
  <svg width='165' height='85' viewBox='0 0 165 85' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g filter='url(#filter0_d_197_60948)'>
      <path
        d='M10.8047 57.4151C11.3409 57.6733 12.358 58.1175 18.5715 52.4978C26.3383 45.4732 33.399 40.556 41.1658 46.8781C48.9325 53.2003 53.875 68.6545 63.76 64.4397C73.645 60.2249 77.1754 28.6142 89.1786 24.3994C101.182 20.1846 108.949 44.7708 117.421 31.424C125.894 18.0772 135.073 1.21829 141.428 3.32567C146.512 5.01158 151.548 11.9894 153.431 15.2676'
        stroke={color}
        strokeWidth='2.48046'
      />
    </g>
    <defs>
      <filter
        id='filter0_d_197_60948'
        x='0.344519'
        y='0.663579'
        width='164.084'
        height='84.3378'
        filterUnits='userSpaceOnUse'
        colorInterpolationFilters='sRGB'
      >
        <feFlood floodOpacity='0' result='BackgroundImageFix' />
        <feColorMatrix
          in='SourceAlpha'
          type='matrix'
          values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          result='hardAlpha'
        />
        <feOffset dy='8.68161' />
        <feGaussianBlur stdDeviation='4.96092' />
        <feComposite in2='hardAlpha' operator='out' />
        <feColorMatrix
          type='matrix'
          values='0 0 0 0 0.117647 0 0 0 0 0.654902 0 0 0 0 1 0 0 0 0.4 0'
        />
        <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_197_60948' />
        <feBlend
          mode='normal'
          in='SourceGraphic'
          in2='effect1_dropShadow_197_60948'
          result='shape'
        />
      </filter>
    </defs>
  </svg>
);

export default TrendTaskIcon;

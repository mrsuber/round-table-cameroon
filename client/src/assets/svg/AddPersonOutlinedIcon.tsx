import React from 'react';
import { svgProps } from './svgProps';

const AddPersonOutlinedIcon = ({
  color = '#4F4F4F',
  size = '20',
  className,
  style,
  ...props
}: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    style={style}
  >
    <path
      d='M14.6875 5.625C14.5344 7.69023 12.9688 9.375 11.25 9.375C9.53128 9.375 7.96292 7.69063 7.81253 5.625C7.65628 3.47656 9.17972 1.875 11.25 1.875C13.3204 1.875 14.8438 3.51562 14.6875 5.625Z'
      stroke={color}
      strokeWidth='1.2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M11.2499 11.875C7.8515 11.875 4.40228 13.75 3.764 17.2891C3.68588 17.7156 3.92846 18.125 4.37533 18.125H18.1249C18.5718 18.125 18.8132 17.7156 18.7363 17.2891C18.0976 13.75 14.6484 11.875 11.2499 11.875Z'
      stroke={color}
      strokeWidth='1.2'
      strokeMiterlimit='10'
    />
    <path
      d='M5.625 9.0625H1.25M3.4375 6.875V11.25V6.875Z'
      stroke={color}
      strokeWidth='1.2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default AddPersonOutlinedIcon;

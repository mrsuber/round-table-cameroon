import React from 'react'
import { svgProps } from './svgProps'

const ArrowLeftIcon = ({ size = '19', color = '#000', onClick, className }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{ cursor: 'pointer' }}
    className={className}
    onClick={onClick}
  >
    <path
      d='M15 19.9201L8.48 13.4001C7.71 12.6301 7.71 11.3701 8.48 10.6001L15 4.08008'
      stroke={color}
      strokeWidth='1.5'
      strokeMiterlimit='10'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export default ArrowLeftIcon

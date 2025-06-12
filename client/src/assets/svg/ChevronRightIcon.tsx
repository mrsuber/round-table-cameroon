import React from 'react'
import { svgProps } from './svgProps'

const ChevronRightIcon = ({ size = '19', color = '#000', onClick, className }: svgProps) => (
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
      d='M8.91 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91 4.08008'
      stroke={color}
      strokeWidth='1.5'
      strokeMiterlimit='10'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export default ChevronRightIcon

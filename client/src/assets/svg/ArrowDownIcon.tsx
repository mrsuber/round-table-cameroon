import React from 'react'
import { svgProps } from './svgProps'

const ArrowDownIcon = ({ color = '#141522', width = '18', height = '10', style }: svgProps) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 18 10'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={style}
  >
    <path
      d='M1.5 0.833009L9 8.33301L16.5 0.833009'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
    />
  </svg>
)

export default ArrowDownIcon

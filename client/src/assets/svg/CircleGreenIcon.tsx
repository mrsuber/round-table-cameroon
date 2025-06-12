import React from 'react'
import { svgProps } from './svgProps'

const CircleGreenIcon = ({ size = '20', style, color = '#003B33' }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={style}
  >
    <circle cx='10' cy='10' r='8' stroke={color} strokeWidth='4' />
  </svg>
)

export default CircleGreenIcon

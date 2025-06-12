import React from 'react'
import { svgProps } from './svgProps'

const CircleGreyIcon = ({ size = '20', style, color = '#F5F5F7' }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={style}
  >
    <circle cx='10' cy='10' r='9' stroke={color} strokeWidth='2' />
  </svg>
)

export default CircleGreyIcon

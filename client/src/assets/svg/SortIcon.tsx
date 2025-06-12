import React from 'react'
import { svgProps } from './svgProps'

const SortIcon = ({ size = '24', color = '#8E92BC' }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M3 7H21' stroke={color} strokeWidth='1.5' strokeLinecap='round' />
    <path d='M6 12H18' stroke={color} strokeWidth='1.5' strokeLinecap='round' />
    <path d='M10 17H14' stroke={color} strokeWidth='1.5' strokeLinecap='round' />
  </svg>
)

export default SortIcon

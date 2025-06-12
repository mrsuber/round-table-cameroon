import React from 'react'
import { svgProps } from './svgProps'

const HamburgerIcon = ({ size = '26', color = '#FDFDFD', ...props }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 26 26'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M3.87185 7.93555H22.1568' stroke={color} strokeWidth='1.02365' strokeLinecap='round' />
    <path d='M3.87185 13.0146H22.1568' stroke={color} strokeWidth='1.02365' strokeLinecap='round' />
    <path d='M3.87185 18.0938H22.1568' stroke={color} strokeWidth='1.02365' strokeLinecap='round' />
  </svg>
)

export default HamburgerIcon

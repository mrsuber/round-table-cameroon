import React from 'react'
import { svgProps } from './svgProps'

const ClockIcon = ({ size = '20', color = '#004C41', className, style }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={style}
    className={className}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M19.2498 10.001C19.2498 15.11 15.1088 19.251 9.99976 19.251C4.89076 19.251 0.749756 15.11 0.749756 10.001C0.749756 4.89198 4.89076 0.750977 9.99976 0.750977C15.1088 0.750977 19.2498 4.89198 19.2498 10.001Z'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M13.4314 12.9437L9.66138 10.6947V5.84766'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export default ClockIcon

import React from 'react'
import { svgProps } from './svgProps'

const AttachmentIcon = ({ color = '#9C9CA4', size = '24', style, className }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={style}
    className={className}
  >
    <path
      d='M12.2 11.8002L10.79 13.2102C10.01 13.9902 10.01 15.2602 10.79 16.0402C11.57 16.8202 12.84 16.8202 13.62 16.0402L15.84 13.8202C17.4 12.2602 17.4 9.73023 15.84 8.16023C14.28 6.60023 11.75 6.60023 10.18 8.16023L7.76 10.5802C6.42 11.9202 6.42 14.0902 7.76 15.4302'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export default AttachmentIcon

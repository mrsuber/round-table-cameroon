import React from 'react'
import { svgProps } from './svgProps'

const ArrowBackOutlinedIcon = ({ color = '#00262A', size = '18', onClick, ...props }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 18 18'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    onClick={onClick}
    {...props}
  >
    <circle cx='9' cy='9' r='8.73529' stroke={color} strokeWidth='0.529412' />
    <path
      d='M5.63627 8.81282C5.53289 8.9162 5.53289 9.0838 5.63627 9.18718L7.32085 10.8718C7.42422 10.9751 7.59182 10.9751 7.6952 10.8718C7.79857 10.7684 7.79857 10.6008 7.6952 10.4974L6.19779 9L7.6952 7.5026C7.79857 7.39922 7.79857 7.23162 7.6952 7.12825C7.59182 7.02487 7.42422 7.02487 7.32085 7.12825L5.63627 8.81282ZM11.647 8.73529H5.82344V9.26471H11.647V8.73529Z'
      fill={color}
    />
  </svg>
)

export default ArrowBackOutlinedIcon

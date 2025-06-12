import React from 'react'
import { svgProps } from './svgProps'

const CheckedIcon = ({
  size = '24',
  color = '#B0E4DD',
  insetColor = '#00262A',
  style,
}: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{ cursor: 'pointer', ...style }}
  >
    <circle cx='12' cy='12' r='12' fill={color} />
    <circle cx='12.0001' cy='11.9999' r='6.2069' fill={insetColor} />
  </svg>
)

export default CheckedIcon

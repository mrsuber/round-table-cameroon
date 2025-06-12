import React from 'react'
import { svgProps } from './svgProps'

const SearchIcon = ({ color = '#1C1D22', size = '18', onClick }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    onClick={onClick}
  >
    <path
      d='M9.58329 17.5003C13.9555 17.5003 17.5 13.9559 17.5 9.58366C17.5 5.2114 13.9555 1.66699 9.58329 1.66699C5.21104 1.66699 1.66663 5.2114 1.66663 9.58366C1.66663 13.9559 5.21104 17.5003 9.58329 17.5003Z'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M18.3333 18.3337L16.6666 16.667'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export default SearchIcon

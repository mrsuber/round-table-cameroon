import React from 'react'
import { svgProps } from './svgProps'

const ChatTickIcon = ({ size = '18', color = '#004C41' }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 18 18'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M13.5 5.24988L12.4425 4.19238L7.6875 8.94738L8.745 10.0049L13.5 5.24988ZM16.68 4.19238L8.745 12.1274L5.61 8.99988L4.5525 10.0574L8.745 14.2499L17.745 5.24988L16.68 4.19238ZM0.307495 10.0574L4.5 14.2499L5.5575 13.1924L1.3725 8.99988L0.307495 10.0574Z'
      fill={color}
    />
  </svg>
)

export default ChatTickIcon

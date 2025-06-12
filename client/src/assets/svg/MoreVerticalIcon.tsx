import { svgProps } from './svgProps'

const MoreVerticalIcon = ({ color = '#141522', size = '20', onClick, className,...props }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    onClick={onClick}
    {...props}
  >
    <path
      d='M4.16667 8.3335C3.25 8.3335 2.5 9.0835 2.5 10.0002C2.5 10.9168 3.25 11.6668 4.16667 11.6668C5.08333 11.6668 5.83333 10.9168 5.83333 10.0002C5.83333 9.0835 5.08333 8.3335 4.16667 8.3335Z'
      fill={color}
      stroke={color}
    />
    <path
      d='M15.8333 8.3335C14.9167 8.3335 14.1667 9.0835 14.1667 10.0002C14.1667 10.9168 14.9167 11.6668 15.8333 11.6668C16.75 11.6668 17.5 10.9168 17.5 10.0002C17.5 9.0835 16.75 8.3335 15.8333 8.3335Z'
      fill={color}
      stroke={color}
    />
    <path
      d='M10 8.3335C9.08334 8.3335 8.33334 9.0835 8.33334 10.0002C8.33334 10.9168 9.08334 11.6668 10 11.6668C10.9167 11.6668 11.6667 10.9168 11.6667 10.0002C11.6667 9.0835 10.9167 8.3335 10 8.3335Z'
      fill={color}
      stroke={color}
    />
  </svg>
)

export default MoreVerticalIcon

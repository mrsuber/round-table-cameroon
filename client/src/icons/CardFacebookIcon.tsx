import React from 'react'
import { svgProps } from '../assets/svg/svgProps';

const CardFacebookIcon = ({ onClick,...props }: svgProps) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}
      {...props}
    >
      <path
        d='M10.001 0.00195312C4.47895 0.00195312 0.00195312 4.47895 0.00195312 10.001C0.00195312 14.991 3.65795 19.127 8.43895 19.88V12.892H5.89895V10.001H8.43895V7.79795C8.43895 5.28995 9.93195 3.90695 12.215 3.90695C13.309 3.90695 14.455 4.10195 14.455 4.10195V6.56095H13.191C11.951 6.56095 11.563 7.33295 11.563 8.12395V9.99895H14.334L13.891 12.89H11.563V19.878C16.344 19.129 20 14.992 20 10.001C20 4.47895 15.523 0.00195312 10.001 0.00195312Z'
        fill='#E3930F'
      />
    </svg>
  )
}

export default CardFacebookIcon

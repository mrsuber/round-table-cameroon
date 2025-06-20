import React from 'react'
import { svgProps } from './svgProps'

const NotesIcon = ({ size = '24', color = '#004C41' }: svgProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M21.6601 10.4395L20.6801 14.6195C19.8401 18.2295 18.1801 19.6895 15.0601 19.3895C14.5601 19.3495 14.0201 19.2595 13.4401 19.1195L11.7601 18.7195C7.59006 17.7295 6.30006 15.6695 7.28006 11.4895L8.26006 7.29952C8.46006 6.44952 8.70006 5.70952 9.00006 5.09952C10.1701 2.67952 12.1601 2.02952 15.5001 2.81952L17.1701 3.20952C21.3601 4.18952 22.6401 6.25952 21.6601 10.4395Z'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M15.06 19.3896C14.44 19.8096 13.66 20.1596 12.71 20.4696L11.13 20.9896C7.15998 22.2696 5.06997 21.1996 3.77997 17.2296L2.49997 13.2796C1.21997 9.30961 2.27997 7.20961 6.24997 5.92961L7.82997 5.40961C8.23997 5.27961 8.62997 5.16961 8.99997 5.09961C8.69997 5.70961 8.45997 6.44961 8.25997 7.29961L7.27997 11.4896C6.29997 15.6696 7.58998 17.7296 11.76 18.7196L13.44 19.1196C14.02 19.2596 14.56 19.3496 15.06 19.3896Z'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M12.64 8.53027L17.49 9.76027'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M11.66 12.4004L14.56 13.1404'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export default NotesIcon

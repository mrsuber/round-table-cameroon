import React from 'react';
import { svgProps } from '../assets/svg/svgProps';

type Props = {
  size: string;
};

const ChevronIcon = ({
  color = '#00262A',
  size = '32',
  style,
  className,
  onClick,
  ...props
}: svgProps) => {
  return (
    <svg
      style={{ cursor: 'pointer', ...style }}
      className={className}
      onClick={onClick}
      width={size}
      height={size}
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M16 19.9667C15.8222 19.9667 15.6498 19.9334 15.4827 19.8667C15.3155 19.8001 15.1769 19.7112 15.0667 19.6001L8.93332 13.4667C8.68887 13.2223 8.56665 12.9112 8.56665 12.5334C8.56665 12.1556 8.68887 11.8445 8.93332 11.6001C9.17776 11.3556 9.48887 11.2334 9.86665 11.2334C10.2444 11.2334 10.5555 11.3556 10.8 11.6001L16 16.8001L21.2 11.6001C21.4444 11.3556 21.7555 11.2334 22.1333 11.2334C22.5111 11.2334 22.8222 11.3556 23.0666 11.6001C23.3111 11.8445 23.4333 12.1556 23.4333 12.5334C23.4333 12.9112 23.3111 13.2223 23.0666 13.4667L16.9333 19.6001C16.8 19.7334 16.6555 19.8281 16.5 19.8841C16.3444 19.9401 16.1778 19.9676 16 19.9667Z'
        fill={color}
        {...props}
      />
    </svg>
  );
};

export default ChevronIcon;

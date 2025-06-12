import React from 'react';
import classes from './Spinner.module.css';

interface IProps {
  fillColor?: string;
  strokeColor?: string;
  size?: string | number;
}

const Spinner = ({ fillColor = '#d9f2ef', strokeColor = '#006557', size = '20px' }: IProps) => {
  return (
    <div
      className={classes.loader}
      style={{
        border:
          typeof size === 'string'
            ? `${Number(size.replace(/\D/g, '')) / 6}px solid ${fillColor}`
            : `${Number(size) / 6}px solid ${fillColor}`,
        borderTop:
          typeof size === 'string'
            ? `${Number(size.replace(/\D/g, '')) / 6}px solid ${strokeColor}`
            : `${Number(size) / 6}px solid ${strokeColor}`,
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        marginLeft: '2px'
      }}
    ></div>
  );
};

export default Spinner;

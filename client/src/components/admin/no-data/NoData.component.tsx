import React from 'react';
import noDataPlaceholder from '../../../assets/images/no-data.png';
import classes from './NoData.module.css';
import Button from '../button/Button.component';

export interface noDataProps {
  infoText?: string;
  text?: string;
  onClick?: () => void;
  height?: string;
  minHeight?: string;
  renderIcon?: () => React.ReactNode;
  iconAfter?: boolean;
  color?: string;
  border?: string;
  bgColor?: string;
  textMargin?: string;
  image?: string;
  width?: string
  minWidth?: string
  imageWidth?: string
  imageHeight?: string
  fontSize?: string
}

const NoData = ({
  infoText = '',
  text = '',
  onClick,
  height = '60vh',
  minHeight = '',
  renderIcon,
  iconAfter,
  color,
  bgColor = '#003B33',
  border,
  textMargin,
  image,
  width='82vw',
  minWidth='',
  imageWidth='',
  imageHeight='',
  fontSize='16px'
}: noDataProps) => {
  return (
    <div style={{ height, minHeight, width, minWidth }} className={classes.container}>
      <div className={classes.note}>
        <p style={{ fontSize }}>{infoText} 😥😓</p>
      </div>
      <div className={classes.image} style={{ width: imageWidth, height: imageHeight}}>
        <img src={image ?? noDataPlaceholder} alt='no data' crossOrigin='anonymous' />
      </div>
      {text && (
        <Button
          text={text}
          bgColor={bgColor}
          width='30%'
          onClick={onClick}
          renderIcon={renderIcon}
          iconAfter={iconAfter}
          color={color}
          border={border}
          textMargin={textMargin}
        />
      )}
    </div>
  );
};

export default NoData;

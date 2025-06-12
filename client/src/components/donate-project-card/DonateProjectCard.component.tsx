import React from 'react';
import classes from './DonateProjectCard.module.css';

interface IProps {
  title: string;
  description: string;
  cover: string;
  style?: object
}

const DonateProjectCard = ({ title, description, cover, style }: IProps) => {
  return (
    <div className={classes.container} style={style}>
      <div className={classes.image}>
        <img src={cover} alt='cover' />
      </div>
      <div className={classes.title}>{title}</div>
      <div className={classes.description}>{description}</div>
    </div>
  );
};

export default DonateProjectCard;

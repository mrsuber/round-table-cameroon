// Card.tsx
import React from 'react';
import classes from './MagazineCard.module.css';
import Button from '../../admin/button/Button.component';
import { ArrowRightIcon } from '../../../assets/svg';

interface CardProps {
  title: string;
  caption: string;
  buttonText: string;
  onClick?: () => void;
  image: string;
}

const MagazineCard: React.FC<CardProps> = ({
  title = '',
  caption = '',
  buttonText = '',
  onClick,
  image,
}) => {
  return (
    <div className={classes.card}>
      <div>
        <img className={classes.cardImg} src={image} alt='Card' />
        <h2 className={classes.cardTitle}>{title}</h2>
        <p className={classes.cardParagraph}>{caption}</p>
      </div>
      <Button
        text='Read More'
        onClick={onClick}
        width='50%'
        renderIcon={() => <ArrowRightIcon color='rgb(3, 110, 103)' style={{ marginLeft: '6px' }} />}
        iconAfter
        bgColor='rgba(3, 110, 103, 0.09)'
        color='rgb(3, 110, 103)'
      />
    </div>
  );
};

export default MagazineCard;

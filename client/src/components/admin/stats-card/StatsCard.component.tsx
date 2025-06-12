import React from 'react';
import { NoteIcon, TrendTaskIcon } from '../../../assets/svg';
import classes from './StatsCard.module.css';

const StatsCard = ({
  color,
  title,
  amount,
}: {
  color?: string;
  title?: string;
  amount?: string;
}) => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.titles}>
          <NoteIcon />
          <span className={classes.title}>{title}</span>
        </div>
        <h4 className={classes.amount}>{amount}</h4>
      </div>
      <hr className={classes.hairline} />
      <div className={classes.trendValue}>
        <TrendTaskIcon color={color} />
        <div className={classes.trendText}>
          <div className={classes.trendValue}>
            <span className={classes.incValue}>10+</span>More
          </div>
          <span style={{ textAlign: 'right' }}>from last week</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

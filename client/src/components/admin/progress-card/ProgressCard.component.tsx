import React from 'react';
import classes from './ProgressCard.module.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ProgressCardTypes } from './ProgressCard.type';

const ProgressCard = ({
  width = '',
  height = '',
  amount = '25',
  total,
  percentage = 0,
}: ProgressCardTypes) => {
  return (
    <div className={classes.container} style={{ width, height }}>
      <div>
        <span className={classes.label}>Running Projects</span>
        <h2 className={classes.number}>{amount}</h2>
      </div>
      <div className={classes.progress}>
        <div style={{ width: '68px', height: '68px' }}>
          <CircularProgressbar
            value={percentage === 0 ? 0 : percentage}
            strokeWidth={5}
            styles={buildStyles({
              pathColor: '#74bbc2',
              trailColor: '#D8D8D8',
              textColor: '#fff',
              textSize: '24px',
            })}
            text={`${percentage}%`}
          />
        </div>
        <div className={classes.totalProjects}>
          <span className={classes.projectNum}>{total}</span> <br />
          <span className={classes.text}>Projects</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;

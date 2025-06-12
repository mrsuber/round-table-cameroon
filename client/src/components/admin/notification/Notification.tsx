import React from 'react';
import { NotificationIcon } from '../../../assets/svg';
import classes from './Notification.module.css';

interface IProps {
  onClick?: () => void;
  color?: string
  size?: string
}

const Notification = ({ onClick, color, size='18' }: IProps) => {
  return (
    <div className={classes.container} onClick={onClick}>
      <div className={classes.bellIcon}>
        <NotificationIcon size={size} color={color} />
      </div>
      <div className={classes.notified} />
    </div>
  );
};

export default Notification;

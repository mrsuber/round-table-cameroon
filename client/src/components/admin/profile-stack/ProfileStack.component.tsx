import React from 'react';
import classes from './ProfileStack.module.css';
import Avatar from '../avatar/Avatar.component';
import placeholder from '../../../assets/images/placeholer.png';

interface IProps {
  contributors: any;
  size?: string | number;
  style?: object
}

const ProfileStack = ({ contributors, size = 27, style }: IProps) => {
  return (
    <div className={classes.profiles} style={style}>
      <div style={{ display: 'flex' }}>
        {contributors?.map((item: any, index: number) => (
          <Avatar
            id={classes.avatar}
            key={`${item._id} ${index}`}
            src={item?.profileImage?.httpPath || placeholder}
            size={size}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileStack;

import React, { ReactNode } from 'react';
import create1 from '../../../assets/images/create-1.png';
import create2 from '../../../assets/images/create-2.png';
import classes from './SubscribeSection.module.css';
import Input from '../../admin/input/Input.component';
import Button from '../../admin/button/Button.component';

interface IProps {
  title: ReactNode;
  caption: string;
  style?: object;
}

const SubscribeSection = ({ title, caption, style }: IProps) => {
  return (
    <div className={classes.container} style={style}>
      <div className={classes.illustration}>
        <img src={create1} alt='creating' />
      </div>
      <div className={classes.texts}>
        {title}
        <p className={classes.caption}>{caption}</p>
        <div className={classes.subscribeInput}>
          <Input
            placeholder='Enter your email'
            style={{ alignSelf: 'center' }}
            renderIcon={() => <Button text='Subscribe' bgColor='#036E67' />}
            outerPadding='0 3px 0 0'
          />
        </div>
      </div>
      <div className={`${classes.illustration} ${classes.illustrationRight}`}>
        <img src={create2} alt='creating' />
      </div>
    </div>
  );
};

export default SubscribeSection;

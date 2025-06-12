import React, { ReactNode, useState } from 'react';
import { flag } from '../../../static/assets/images';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '../../../assets/svg';
import styles from './hero.module.css';
import Logo from '../../../icons/Logo';
import hero from '../../../static/assets/images/RT/monument.jpeg';
import Button from '../../admin/button/Button.component';
import { useAppSelector } from '../../../store';

export interface heroIProps {
  logoImage?: string;
  logoBgColor?: string;
  heroImage?: string;
  buttonColor?: string | any;
  headingWidth?: string;
}

const Hero = ({
  logoImage,
  logoBgColor = '',
  heroImage = hero,
  headingWidth,
  buttonColor = '0, 38, 42',
}: heroIProps) => {
  const { theming } = useAppSelector((state) => state.theming);
  const defaultColor = '0, 38, 42';
  console.log('theming', theming.color);

  return (
    <div
      className={styles.hero__container}
      style={{
        backgroundImage: `linear-gradient(rgba(${
          theming.color || buttonColor || defaultColor
        },0.8), rgba(${theming.color || buttonColor || defaultColor},0.8)),
      url(${heroImage || theming.bgImage})`,
      }}
    >
      <div className={styles.logo} style={{ backgroundColor: logoBgColor }}>
        {theming.logo || logoImage ? (
          <img
            src={logoImage || theming.logo}
            alt='logoImage'
            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
          />
        ) : (
          <Logo width='100%' height='100%' />
        )}
      </div>
      <h1 className={styles.hero__heading} style={{ width: headingWidth ?? '40%' }}>
        Welcome to round table cameroon
      </h1>
      <p className={styles.hero__p}>a social platform for private investment</p>
      <div className={styles.flag}>
        <img src={flag} alt='Flag' crossOrigin='anonymous' />
      </div>
      <Link to='/auth?tab=signup' style={{ textDecoration: 'none' }}>
        <Button
          text='Join Our Community'
          style={{ marginRight: '15px' }}
          renderIcon={() => (
            <ArrowRightIcon style={{ width: '14', height: '12', marginLeft: '5px' }} />
          )}
          iconAfter
          padding='13px 20px'
          bgColor={`rgb(${theming.color || buttonColor || defaultColor})`}
        />
      </Link>
    </div>
  );
};

export default Hero;

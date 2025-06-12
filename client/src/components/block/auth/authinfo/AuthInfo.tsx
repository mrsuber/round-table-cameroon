import React, { useEffect, useState } from 'react';
import Logo from '../../../../icons/Logo';

import styles from './authinfo.module.css';
import stylesS from '../signup/signupcontent.module.css';
import Button from '../../../admin/button/Button.component';

type Props = {
  heading: string;
  description: string;
  btnText: string;
  link: string;
  animate?: boolean;
  onClick?: (str: string) => void;
};

const AuthInfo: React.FC<Props> = ({ heading, description, btnText, link, animate, onClick }) => {
  const [animateBlock, setAnimateBlock] = useState(false);

  useEffect(() => {
    setAnimateBlock(true);
  }, [animate]);

  useEffect(() => {
    if (animateBlock) {
      setTimeout(() => {
        setAnimateBlock(false);
      }, 1000);
    }
  }, [animateBlock]);

  return (
    <div className={`${styles.auth__info} ${animateBlock ? styles.animate : ''}`}>
      <div className={`${styles.flexDis}`}>
        <div className={styles.logo}>
          <Logo width={100} height={100} />
        </div>
        <h3 className={stylesS.head}>{heading}</h3>
        <p className={styles.instructions}>{description}</p>
      </div>
      <div onClick={() => onClick?.(link)}>
        <Button
          text={btnText}
          padding='13px 20px'
          style={{ border: '1px solid #fff', marginTop: '14rem' }}
          bgColor='transparent'
          color='#fff'
        />
      </div>
    </div>
  );
};

export default AuthInfo;

import React from 'react';
import Button from '../../../../shared/button/Button';

import styles from '../block.module.css';
import BackwardArrow from '../../../../../icons/BackwardArrow';
import { Link } from 'react-router-dom';
import EmailStrokes from '../../../../../icons/EmailStrokes';
import { BlockClickProps } from '../block1/Block1';
import { paths } from '../../../../../routers/paths';

const Block2: React.FC<BlockClickProps> = ({ setBlock }) => {
  const localEmail = localStorage.getItem('email');
  return (
    <div className={styles.parent__container}>
      <div className={styles.logo}>
        <EmailStrokes />
      </div>
      <h3 className={styles.heading3}>Check Your Mail</h3>
      <p className={styles.password__resend}>We send a password reset link to {localEmail}</p>
      <div className={`${styles.extra__styles} ${styles.btn__div}`}>
        <Button
          btnText='Open Email App'
          className={`${styles.extra__btn__styles} ${styles.btn1}`}
        />
      </div>
      <p className={styles.resend__link}>
        <span style={{ marginRight: '10px' }}>Didn&apos;t receive Email ?</span>{' '}
        <span onClick={() => setBlock && setBlock(1)}>Resend</span>
      </p>
      <div className={styles.go__back}>
        <span>
          {' '}
          <BackwardArrow />{' '}
        </span>
        <p className={styles.text}>
          <Link to={paths.AUTH}>Back to sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Block2;

import React from 'react';
import Button from '../../../../shared/button/Button';

import styles from '../block.module.css';
import { Link } from 'react-router-dom';
import Success from '../../../../../icons/Success';

export type BlockClickProps = {
  setBlock?: React.Dispatch<React.SetStateAction<number>>;
};

const Block5: React.FC<BlockClickProps> = () => {
  return (
    <div className={styles.parent__container}>
      <div className={styles.logo}>
        <Success />
      </div>
      <h3 className={styles.heading3}>Password Reset</h3>
      <p className={`${styles.new__password} ${styles.success}`}>
        Your New Password has been successfully reset. Click below to continue
      </p>
      <div className={styles.btn__div}>
        <Link to='/'>
          <Button btnText='Continue' className={`${styles.extra__styles} ${styles.btn1}`} />
        </Link>
      </div>
    </div>
  );
};

export default Block5;

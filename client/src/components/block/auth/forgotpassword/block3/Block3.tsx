import React, { useState } from 'react';
import PinInput from 'react-pin-input';

import Button from '../../../../shared/button/Button';
import styles from '../block.module.css';
import { Link } from 'react-router-dom';
import { BlockClickProps } from '../block1/Block1';
import EmailLogo from '../../../../../icons/EmailLogo';

const Block3: React.FC<BlockClickProps> = ({ setBlock }) => {
  const [, setPin] = useState<string>('');

  return (
    <div className={styles.parent__container}>
      <div className={styles.logo}>
        <EmailLogo />
      </div>
      <h3 className={styles.heading3}>Verify account</h3>
      <p className={`${styles.additional} ${styles.password__resend}`}>
        Enter the 6 digit code we sent to your email address to verify your new account
      </p>
      <div>
        <PinInput
          length={6}
          initialValue=''
          secret={false}
          onChange={(value: string, index: number) => {
            setPin(value);
          }}
          type='numeric'
          inputMode='number'
          style={{
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // flexWrap: 'wrap',
          }}
          inputStyle={{
            border: '1px solid #000000',
            background: '#FFFFFF',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
            color: '#000000',
            margin: '0.3rem',
            fontWeight: 700,
            fontSize: '40px',
            width: '40px',
            height: '53px',
          }}
          autoSelect={true}
          regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
        />
      </div>
      <p className={styles.expirery_time}>
        The code expires in <span> 0:30 </span>
      </p>
      <div className={`${styles.extra__styles} ${styles.btn__div}`}>
        <Button
          btnText='Verify & Continue'
          className={`${styles.extra__btn__styles} ${styles.btn1}`}
          onClick={() => {
            if (setBlock !== undefined) {
              setBlock(3);
            }
          }}
        />
      </div>
      <p className={styles.resend__link}>
        Didn&apos;t receive Email? <Link to=''> Resend Code</Link>
      </p>
    </div>
  );
};

export default Block3;

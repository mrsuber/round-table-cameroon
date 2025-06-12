import React, { useState } from 'react';
import CustomInputField from '../../../../shared/auth/input/CustomInput';
import Button from '../../../../shared/button/Button';
import { NewPasswordDataType } from '../../../../../types';

import styles from '../block.module.css';
import BackwardArrow from '../../../../../icons/BackwardArrow';
import { Link } from 'react-router-dom';
import EmailStrokes from '../../../../../icons/EmailStrokes';
import Key from '../../../../../icons/Key';
import Eye from '../../../../../icons/Eye';

export type BlockClickProps = {
  setBlock?: React.Dispatch<React.SetStateAction<number>>;
};

const Block4: React.FC<BlockClickProps> = ({ setBlock }) => {
  const [passwordShow, setPasswordShow] = useState<boolean>(false);

  const [formEmail, setFormEmail] = useState<NewPasswordDataType>({
    password: '',
    confirmPassword: '',
  });

  const handleShowPassword = () => {
    setPasswordShow(!passwordShow);
  };

  const { confirmPassword, password } = formEmail;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormEmail({ ...formEmail, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.parent__container}>
      <div className={styles.logo}>
        <EmailStrokes />
      </div>
      <h3 className={styles.heading3}>Set New Password</h3>
      <p className={styles.new__password}>Your New Password must be different from the previous</p>
      <p className={styles.input__label}>Password</p>
      <CustomInputField
        name='password'
        type={passwordShow ? 'text' : 'password'}
        value={password}
        onChange={onChange}
        left={true}
        placeholder='Enter your Password'
        icon={<Key />}
        iconRight={<Eye onClick={handleShowPassword} style={{ cursor: 'pointer' }} />}
      />
      <p style={{ paddingTop: '2rem' }} className={styles.input__label}>
        Confirm Password
      </p>
      <CustomInputField
        name='confirmPassword'
        type={passwordShow ? 'text' : 'password'}
        value={confirmPassword}
        onChange={onChange}
        left={true}
        placeholder='Enter your Password'
        icon={<Key />}
        iconRight={<Eye onClick={handleShowPassword} style={{ cursor: 'pointer' }} />}
      />
      <div className={styles.btn__div}>
        <Button
          btnText='Reset Password'
          className={styles.btn1}
          onClick={() => {
            if (setBlock !== undefined) {
              setBlock(4);
            }
          }}
        />
      </div>
      <div className={styles.go__back}>
        <span>
          {' '}
          <BackwardArrow />{' '}
        </span>
        <p className={styles.text}>
          <Link to='/login'>Back to sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Block4;

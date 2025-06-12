import React, { useState } from 'react';
import Email from '../../../../../icons/Email';
import PasswordKey from '../../../../../icons/PasswordKey';
import CustomInputField from '../../../../shared/auth/input/CustomInput';

import styles from '../block.module.css';
import BackwardArrow from '../../../../../icons/BackwardArrow';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordAction } from '../../../../../store/features/slices/auth/auth.action';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { toast } from 'react-toastify';
import { validateEmail } from '../../../../../lib/utils/validateFunction';
import { paths } from '../../../../../routers/paths';
import Button from '../../../../admin/button/Button.component';

export type BlockClickProps = {
  setBlock?: React.Dispatch<React.SetStateAction<number>>;
};

const Block1: React.FC<BlockClickProps> = ({ setBlock }) => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.loader);
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    const validatedEmail = validateEmail(email.trim());
    if (setBlock !== undefined && email) {
      if (validatedEmail === false) {
        setError('Please enter a valid email');
        return;
      } else {
        setError('');
        dispatch(forgotPasswordAction(email.trim()))
          .then((res) => {
            const { payload } = res;
            if (payload.status === 404) {
              toast.error(payload?.message);
              return;
            } else {
              toast.success(payload?.message);
              setBlock(1);
              return;
            }
          })
          .catch((err) => {
            toast.error(err?.message);
            return;
          });
      }
    } else {
      setError('Please enter a valid email');
      return;
    }
  };

  return (
    <div className={styles.parent__container}>
      <div className={styles.logo}>
        <PasswordKey />
      </div>
      <h3 className={styles.heading3}>Forgot Password?</h3>
      <p className={styles.input__label}>Email</p>
      <CustomInputField
        name='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        left={true}
        placeholder='Enter your Email'
        icon={<Email />}
        error={error}
      />
      <div className={styles.btn__div}>
        <Button
          loading={loading}
          text='Reset Password'
          onClick={handleForgotPassword}
          padding='14px'
        />
      </div>
      <Button
        text='Back To Sign in'
        bgColor=''
        color='#003B33'
        renderIcon={() => <BackwardArrow />}
        margin='20px 0'
        onClick={() => navigate(paths.AUTH)}
      />
    </div>
  );
};

export default Block1;

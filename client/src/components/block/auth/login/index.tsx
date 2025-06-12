import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Email from '../../../../icons/Email';
import Eye from '../../../../icons/Eye';
import Facebook from '../../../../icons/Facebook';
import Google from '../../../../icons/Google';
import Key from '../../../../icons/Key';
import Linkedin from '../../../../icons/Linkedin';
import { LoginDataType } from '../../../../types';
import CustomInputField from '../../../shared/auth/input/CustomInput';

import styles from './logincontent.module.css';
import { validateLogin } from '../../../../lib/utils/validateFunction';
import { loginUserAction } from '../../../../store/features/slices/auth/auth.action';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { paths } from '../../../../routers/paths';
import { setLocalEmail } from '../../../../utils/localStorage';
import Button from '../../../admin/button/Button.component';

const LoginBlock = () => {
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [formErrors, setFormError] = useState({} as LoginDataType);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.loader);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const { user } = useAppSelector((state) => state.auth);

  const handleShowPassword = () => {
    setPasswordShow(!passwordShow);
  };

  const navigateData = (payload: any) => {
    switch (payload?.status) {
      case 400:
        toast.error(payload?.message);
        navigate(paths.VERIFICATION);
        break;
      case 401:
        toast.error(payload?.message);
        break;
      case 404:
        toast.error(payload?.message);
        break;
      case 500:
        toast.error('Wrong Credentials Given');
        break;
      case 200:
        toast.success('Login successful!');
        navigate(paths.ADMIN.DASHBOARD);
        break;
      default:
        return;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { email: email.trim(), password: password.trim() };
    setLocalEmail(email.trim());
    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!password) {
      setPasswordError('Password is required');
      return;
    } else {
      setEmailError('');
      setPasswordError('');
      dispatch(loginUserAction(data))
        .then((res) => {
          const { payload }: any = res;
          console.log(payload, 'res res');
          if (Array.isArray(payload?.data?.errors)) {
            payload?.data?.errors.forEach((err: any) => {
              toast.error(err);
            });
            return;
          } else {
            navigateData(payload);
          }
        })
        .catch((err) => {
          toast.error(err?.message);
          return;
        });
    }
  };
  return (
    <div className={styles.left}>
      <div className={styles.flexDisplay}>
        <h1 className={styles.head}>Sign into Round table</h1>
        <div className={styles.icons}>
          <Google style={{ cursor: 'pointer' }} />
          <Linkedin style={{ margin: ' 0 2rem', cursor: 'pointer' }} />
          <Facebook />
        </div>
        <p>Or use your Email account</p>
        <form action='' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CustomInputField
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            left={true}
            placeholder='Email'
            icon={<Email />}
            error={emailError}
          />
          <CustomInputField
            name='password'
            type={passwordShow ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            left={true}
            placeholder='Password'
            icon={<Key />}
            iconRight={<Eye onClick={handleShowPassword} style={{ cursor: 'pointer' }} />}
            error={passwordError}
          />
          <span className={styles.forgot__password}>
            <Link to='/forgot-password'> Forgot your Password?</Link>
          </span>
        </form>
      </div>
      <Button
        text='SIGN IN'
        onClick={handleSubmit}
        loading={loading}
        width='30%'
        padding='16px'
        margin='12rem 0 0'
        spinnerSize='13px'
      />
    </div>
  );
};

export default LoginBlock;

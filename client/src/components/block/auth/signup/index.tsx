import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Email from '../../../../icons/Email';
import Eye from '../../../../icons/Eye';
import Facebook from '../../../../icons/Facebook';
import Google from '../../../../icons/Google';
import Key from '../../../../icons/Key';
import Linkedin from '../../../../icons/Linkedin';
import User from '../../../../icons/User';
import { validateRegister } from '../../../../lib/utils/validateFunction';
import CustomInputField from '../../../shared/auth/input/CustomInput';

import styles from './signupcontent.module.css';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { registerUserAction } from '../../../../store/features/slices/auth/auth.action';
import { RegisterDataType } from '../../../../types';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../routers/paths';
import Button from '../../../admin/button/Button.component';

const SignupBlock = () => {
  const { loading } = useAppSelector((state) => state.loader);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [formErrors, setFormError] = useState({} as RegisterDataType);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState<string>('');
  const [lastNameError, setLastNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const handleShowPassword = () => {
    setPasswordShow(!passwordShow);
  };

  const navigateData = (payload: any) => {
    switch (payload?.status) {
      case 409:
        toast.error(payload?.message);
        break;
      case 500:
        toast.error(payload?.message);
        break;
      default:
        toast.success('Please enter verification code sent to your mail');
        navigate(paths.VERIFICATION);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { firstName, lastName, email: email.trim(), password: password.trim() };

    if (!firstName) {
      setFirstNameError('First name is required');
      return;
    } else if (!lastName) {
      setLastNameError('Last name is required');
      return;
    } else if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!password) {
      setPasswordError('Password is required');
      return;
    } else {
      dispatch(registerUserAction(data))
        .then((res) => {
          const { payload } = res;
          console.log('res', res)
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
      <h1 className={styles.head}>Create Account</h1>
      <div className={styles.icons}>
        <Google />
        <Linkedin style={{ margin: ' 0 2rem', cursor: 'pointer' }} />
        <Facebook />
      </div>
      <p>Or use your Email account</p>
      <form action=''>
        <CustomInputField
          name='firstName'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          left={true}
          placeholder='First Name'
          icon={<User />}
          error={firstNameError}
        />
        <CustomInputField
          name='lastName'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          left={true}
          placeholder='Last Name'
          icon={<User />}
          error={lastNameError}
        />
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
      </form>
      <Button
        text='SIGN UP'
        onClick={handleSubmit}
        loading={loading}
        width='30%'
        padding='16px'
        margin='20px 0 0'
      />
    </div>
  );
};

export default SignupBlock;

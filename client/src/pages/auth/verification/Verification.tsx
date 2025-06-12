import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import AuthInfo from '../../../components/block/auth/authinfo/AuthInfo';
import AuthLayout, { Directions } from '../../../components/layout/authlayout/AuthLayout';

import NavBar from '../../../components/shared/navbar/NavBar';

import { EmailLogo } from '../../../assets/svg';
import { useAppDispatch, useAppSelector } from '../../../store';
import { useNavigate } from 'react-router-dom';
import {
  loginUserAction,
  resendVerificationCodeAction,
  verifyAccountAction,
} from '../../../store/features/slices/auth/auth.action';
import { paths } from '../../../routers/paths';
import { getLocalPass, getLocalEmail } from '../../../utils/localStorage';
import styles from '../authstyles.module.css';
import Button from '../../../components/admin/button/Button.component';

const Verification = () => {
  const [otp, setOtp] = useState('');

  const { loading } = useAppSelector((state) => state.loader);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const localPass = getLocalPass();
  const localEmail = getLocalEmail();

  const [timer, setTimer] = React.useState(60);
  const id = React.useRef<any>(null);

  const clear = () => {
    window.clearInterval(id.current);
  };
  React.useEffect(() => {
    id.current = window.setInterval(() => {
      setTimer((time) => time - 1);
    }, 1000);
    return () => clear();
  }, []);

  React.useEffect(() => {
    if (timer === 0) {
      clear();
    }
  }, [timer]);

  const navigateData = (payload: any) => {
    const message = payload?.message;
    switch (payload.status) {
      case 400:
        toast.error(payload?.message);
        navigate(paths.VERIFICATION);
        break;
      case 400 && message === 'Wrong credentials given':
        toast.error(payload?.message);
        navigate(paths.AUTH);
        break;
      case 404:
        toast.error(payload?.message);
        break;
      default:
        navigate(paths.HOME);
    }
  };

  const handleVerifyAccount = () => {
    const data = { email: localEmail, otp };
    if (otp) {
      dispatch(verifyAccountAction(data))
        .then((res) => {
          const { payload } = res;
          if (payload.status === 400) {
            toast.error(payload?.message);
            return;
          } else {
            const loginData: any = { email: localEmail?.trim(), password: localPass?.trim() };
            dispatch(loginUserAction(loginData))
              .then((res) => {
                const { payload } = res;
                navigateData(payload);
              })
              .catch((err) => {
                toast.error(err?.message);
                return;
              });
            navigate(paths.AUTH);
          }
        })
        .catch((err) => {
          toast.error(err?.message);
          return;
        });
    } else {
      toast.error('Please enter the verification code');
    }
  };

  const handleResend = () => {
    dispatch(resendVerificationCodeAction(localEmail))
      .then((res) => {
        const { payload } = res;
        if (payload.status === 404) {
          toast.error(payload?.message);
          return;
        } else {
          toast.success(payload?.message);
          return;
        }
      })
      .catch((err) => {
        toast.error(err?.message);
        return;
      });
  };

  return (
    <div>
      <NavBar />
      <div style={{ height: '95px', background: 'white' }}></div>
      <div className={styles.auth__container}>
        <AuthLayout dir={Directions.right}>
          <>
            <div className={styles.container}>
              <EmailLogo />
              <h2 className={styles.header}>Verify Account</h2>
              <p className={styles.caption}>
                Enter the 6 digit code we sent to your email address to verify your new account
              </p>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => <input {...props} className={styles.otpInput} />}
                containerStyle={{ margin: '3rem 0' }}
              />
              <div className={styles.expiration}>
                <p>
                  Code expires in: <span style={{ color: 'red', fontWeight: 'bold' }}>{timer}</span>
                </p>
              </div>
              <Button
                text='Verify & Continue'
                textStyle={{ fontSize: '13px' }}
                margin='7rem 0 0'
                padding='15px'
                onClick={handleVerifyAccount}
                loading={loading}
              />
              <span className={styles.noCode}>
                Didn’t get the code?{' '}
                <span style={{ color: '#004C41', cursor: 'pointer' }} onClick={handleResend}>
                  Resend Code
                </span>
              </span>
            </div>
          </>
          <AuthInfo
            heading='Hello there!'
            description='Enter your personal info and start a journey with us.'
            btnText='Sign up'
            link={paths.AUTHSIGNUP}
            onClick={() => navigate(-1)}
          />
        </AuthLayout>
      </div>
    </div>
  );
};

export default Verification;

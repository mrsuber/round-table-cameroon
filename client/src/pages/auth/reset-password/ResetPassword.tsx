import { useState } from 'react';

import styles from './ResetPassword.module.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomInputField from '../../../components/shared/auth/input/CustomInput';
import Key from '../../../icons/Key';
import Eye from '../../../icons/Eye';
import EmailStrokes from '../../../icons/EmailStrokes';
import BackwardArrow from '../../../icons/BackwardArrow';
import NavBar from '../../../components/shared/navbar/NavBar';
import AuthLayout, { Directions } from '../../../components/layout/authlayout/AuthLayout';
import AuthInfo from '../../../components/block/auth/authinfo/AuthInfo';
import { useAppDispatch, useAppSelector } from '../../../store';
import { resetPasswordAction } from '../../../store/features/slices/auth/auth.action';
import { toast } from 'react-toastify';
import { paths } from '../../../routers/paths';
import { getLocalEmail } from '../../../utils/localStorage';
import Button from '../../../components/admin/button/Button.component';

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.loader);
  const navigate = useNavigate();

  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const localEmail = getLocalEmail();

  const handleShowPassword = () => {
    setPasswordShow(!passwordShow);
  };

  const { token } = useParams();

  const clearInputs = () => {
    setPassword('');
    setConfirmPassword('');
  };

  const handlePasswordReset = () => {
    if (localEmail === null) return;
    else if (password !== confirmPassword) {
      setError('Password does not match');
      return;
    } else if (password === '' || confirmPassword === '') {
      setError('Password required');
      return;
    } else {
      const data = {
        email: localEmail,
        password,
        token,
      };
      clearInputs();
      setError('');
      dispatch(resetPasswordAction(data))
        .then((res) => {
          const { payload } = res;
          if (payload?.status === 400 || payload?.status === 404) {
            toast.error(payload?.message);
            return;
          } else {
            toast.success(payload?.message);
            navigate(paths.AUTH);
            localStorage.removeItem('email');
          }
        })
        .catch((err) => {
          toast.error(err?.message);
          return;
        });
    }
  };

  return (
    <div>
      <NavBar />
      <div className={styles.auth__container}>
        <AuthLayout dir={Directions.right}>
          <>
            <div className={styles.parent__container}>
              <div className={styles.logo}>
                <EmailStrokes />
              </div>
              <h3 className={styles.heading3}>Set New Password</h3>
              <p className={styles.new__password}>
                Your New Password must be different from the previous
              </p>
              <p className={styles.input__label}>Password</p>
              <CustomInputField
                name='password'
                type={passwordShow ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                left={true}
                placeholder='Enter your Password'
                icon={<Key />}
                iconRight={<Eye onClick={handleShowPassword} style={{ cursor: 'pointer' }} />}
                error={error}
              />
              <p style={{ marginTop: '1rem' }} className={styles.input__label}>
                Confirm Password
              </p>
              <CustomInputField
                name='confirm password'
                type={passwordShow ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                left={true}
                placeholder='Enter your Password'
                icon={<Key />}
                iconRight={<Eye onClick={handleShowPassword} style={{ cursor: 'pointer' }} />}
              />
              <div className={styles.btn__div}>
                <Button
                  text='Reset Password'
                  onClick={handlePasswordReset}
                  loading={loading}
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
          </>
          <AuthInfo
            heading='Hello there!'
            description='Enter your personal info and start a journey with us.'
            btnText='Sign up'
            link='/login'
          />
        </AuthLayout>
      </div>
    </div>
  );
};

export default ResetPassword;

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthInfo from '../../../components/block/auth/authinfo/AuthInfo';
import LoginBlock from '../../../components/block/auth/login';
import SignupBlock from '../../../components/block/auth/signup';
import AuthLayout, { Directions } from '../../../components/layout/authlayout/AuthLayout';

import NavBar from '../../../components/shared/navbar/NavBar';

import styles from '../authstyles.module.css';

const Login = () => {
  const [animate, setAnimate] = useState(false);
  const [route, setRoute] = useState('login');
  const [detector, setDetector] = useState(false);

  const [query] = useSearchParams(window.location.search);

  const navigate = useNavigate();

  const handleNavigate = (str: string) => {
    setAnimate(!animate);

    if (str === 'signup') {
      navigate('/auth?tab=signup');
    } else {
      navigate('/auth?tab=login');
    }

    setTimeout(() => {
      setRoute(str);
      setDetector(!detector);
    }, 500);
  };

  useEffect(() => {
    if (query.get('tab') === undefined || query.get('tab') === null) {
      navigate('/auth?tab=login');
    } else {
      setRoute(query.get('tab') as string);
      if (query.get('tab') === 'login') {
        setAnimate(false);
      } else {
        setAnimate(true);
      }
    }
  }, [window.location]);

  return (
    <div>
      <NavBar />
      <div className={styles.auth__container}>
        <AuthLayout animate={animate} dir={Directions.right} formContainerPadding='7rem 6.4rem'>
          {/* <Block1 /> */}
          {route === 'signup' ? <SignupBlock /> : <LoginBlock />}
          {route === 'login' ? (
            <AuthInfo
              heading='Hello there!'
              description='Enter your personal info and start a journey with us.'
              btnText='Sign up'
              link='signup'
              onClick={handleNavigate}
              animate={animate}
            />
          ) : (
            <AuthInfo
              heading='Welcome Back!'
              description='To stay connected with us, please login with your personal info'
              btnText='Sign in'
              link='login'
              onClick={handleNavigate}
              animate={animate}
            />
          )}
        </AuthLayout>
      </div>
    </div>
  );
};

export default Login;

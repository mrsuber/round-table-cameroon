import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthInfo from '../../../components/block/auth/authinfo/AuthInfo';
import SignupBlock from '../../../components/block/auth/signup';
import AuthLayout, { Directions } from '../../../components/layout/authlayout/AuthLayout';

import NavBar from '../../../components/shared/navbar/NavBar';

import styles from '../authstyles.module.css';

const Signup = () => {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (str: string) => {
    if (str === 'login') {
      setAnimate(true);
      setTimeout(() => {
        navigate('/login');
      }, 900);
    }
  };

  return (
    <div>
      <NavBar />
      <div className={styles.auth__container}>
        <AuthLayout
          animate={animate}
          dir={Directions.left}
          formContainerPadding='5rem 6.4rem 7rem'
        >
          <SignupBlock />
          <AuthInfo
            heading='Welcome Back!'
            description='To stay connected with us, please login with your personal info'
            btnText='Sign in'
            link='login'
            onClick={handleNavigate}
          />
        </AuthLayout>
      </div>
    </div>
  );
};

export default Signup;

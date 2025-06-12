import { useState } from 'react';
import AuthInfo from '../../../components/block/auth/authinfo/AuthInfo';
import Block1 from '../../../components/block/auth/forgotpassword/block1/Block1';
import Block2 from '../../../components/block/auth/forgotpassword/block2/Block2';
import Block3 from '../../../components/block/auth/forgotpassword/block3/Block3';
import Block4 from '../../../components/block/auth/forgotpassword/block4/Block4';
import Block5 from '../../../components/block/auth/forgotpassword/block5/Block5';
import AuthLayout, { Directions } from '../../../components/layout/authlayout/AuthLayout';

import NavBar from '../../../components/shared/navbar/NavBar';

import styles from '../authstyles.module.css';
import { paths } from '../../../routers/paths';

const ForgortPassword = () => {
  const [block, setBlock] = useState<number>(0);
  return (
    <div>
      <NavBar />
      <div className={styles.auth__container}>
        <AuthLayout dir={Directions.right}>
          <>
            {block === 0 && <Block1 setBlock={setBlock} />}
            {block === 1 && <Block2 setBlock={setBlock} />}
            {block === 2 && <Block3 setBlock={setBlock} />}
            {block === 3 && <Block5 setBlock={setBlock} />}
          </>
          <AuthInfo
            heading='Hello there!'
            description='Enter your personal info and start a journey with us.'
            btnText='Sign up'
            link={paths.AUTHSIGNUP}
          />
        </AuthLayout>
      </div>
    </div>
  );
};

export default ForgortPassword;

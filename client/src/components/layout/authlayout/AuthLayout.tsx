import React from 'react';

import styles from './authlayout.module.css';

export const enum Directions {
  left = 'LEFT',
  right = 'RIGHT',
}

type Props = {
  dir: Directions;
  children: React.ReactNode[];
  animate?: boolean;
  formContainerPadding?: string
};

const AuthLayout: React.FC<Props> = ({ dir, animate, children, formContainerPadding='' }) => {
  return (
    <div
      className={`${styles.auth__layout} ${
        animate !== undefined && animate ? styles.animate : ''
      } ${dir === Directions.left ? styles.left : ''}`}
    >
      <div className={styles.form__container} style={{ padding: formContainerPadding }}>{children[0]}</div>
      <div className={`${styles.info__container}`}>{children[1]}</div>
    </div>
  );
};

export default AuthLayout;

import React from 'react';
import Logo from '../../icons/Logo';

// style import
import styles from './loader.module.css';

const Loader = ({ size = '90px' }: { size?: string }) => {
  return (
    <div className={styles.container}>
      <div className={styles.loader}>
        <Logo width={size} height={size} />
      </div>
    </div>
  );
};

export default Loader;

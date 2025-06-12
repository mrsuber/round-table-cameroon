import React from 'react';

// styles import
import styles from './sectiontitle.module.css';

type PropsType = {
  title: string;
  height: string;
};

const SectionTitle: React.FC<PropsType> = ({ title, height }) => {
  return (
    <div style={{ background: '#003136', height }} className={styles.container}>
      <h1 className={styles.headline}>{title}</h1>
    </div>
  );
};

export default SectionTitle;

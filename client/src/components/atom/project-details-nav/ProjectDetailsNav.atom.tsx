import React from 'react';

import styles from './projectdetailsnav.module.css';
import BackwardArrow from '../../../icons/BackwardArrow';

type Props = {
  title: string;
};

const ProjectDetailsNav: React.FC<Props> = ({ title }) => {
  return (
    <div className={styles.container}>
      <span>
        <BackwardArrow />
      </span>
      <h3 className={styles.project}>
        Projects / <span className={styles.project__title}>{title}</span>
      </h3>
    </div>
  );
};

export default ProjectDetailsNav;

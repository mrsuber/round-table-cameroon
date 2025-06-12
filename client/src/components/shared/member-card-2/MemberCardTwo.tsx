import React from 'react';
import ArcIcon from '../../../icons/ArcIcon';

// styles import
import pic from '../../../assets/images/placeholer.png';
import styles from './membercard2.module.css';

type Props = {
  image: string;
  name: string;
};

const MemberCardTwo = ({ image, name }: Props) => {
  return (
    <div className={styles.member}>
      <div className={styles.image}>
        <div className={styles.top__illus}>
          <ArcIcon />
        </div>
        <img
          src={image ?? pic}
          alt={name}
          crossOrigin='anonymous'
          style={{ objectFit: 'cover', objectPosition: 'top' }}
        />
        <div className={styles.bottom__illus}>
          <ArcIcon />
        </div>
      </div>

      <div className={styles.body}>
        <h2>{name}</h2>
      </div>
    </div>
  );
};

export default MemberCardTwo;

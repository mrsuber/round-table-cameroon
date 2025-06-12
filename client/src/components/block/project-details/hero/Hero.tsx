import React from 'react';

// styles import
import styles from './hero.module.css';

type Props = {
  img: string;
  title: string;
  user: string;
  name: string;
  type: string;
  description: string;
};

const Hero: React.FC<Props> = ({ img, title, user, name, type, description }) => {
  return (
    <div className={styles.container}>
      <div className={styles.main__img}>
        <img src={img} alt={title} crossOrigin='anonymous' />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.user}>
          <div className={styles.user__img}>
            <img src={user} alt={name} crossOrigin='anonymous' />
          </div>
          <div className={styles.user__details}>
            <h4>{name}</h4>
            <p>{type}</p>
          </div>
        </div>
        <p className={styles.descr}>{description}</p>
      </div>
    </div>
  );
};

export default Hero;

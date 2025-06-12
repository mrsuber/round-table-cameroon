import React from 'react';
import { InstructorType } from '../../../types';
import pic from '../../../assets/images/placeholer.png';

import styles from './card.module.css';

const MemberCard: React.FC<InstructorType> = ({ img, name, description, icons }) => {
  return (
    <div className={styles.card__styles}>
      <div className={styles.rowContent}>
        <div className={styles.img__container}>
          <img
            src={img ?? pic}
            alt={name}
            crossOrigin='anonymous'
            style={{ objectFit: 'cover', objectPosition: 'top', opacity: img ? 1 : 0.5 }}
          />
        </div>
        <h1 className={styles.card__name}>{name}</h1>
      </div>
      <div className={styles.rowContent}>
        {description?.map((text, index) => {
          return (
            <p key={index} className={styles.card__description}>
              {text}
            </p>
          );
        })}
      </div>
      <div className={styles.icon__styles}>
        {icons !== undefined &&
          icons.length > 0 &&
          icons.map((icon, index) => {
            return (
              <div key={index} className={styles.icon}>
                <p>{icon}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MemberCard;

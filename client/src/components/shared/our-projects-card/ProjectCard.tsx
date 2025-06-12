import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import placeholder from '../../../assets/images/placeholer.png';

// styles import
import Button from '../../admin/button/Button.component';
import styles from './projectscard.module.css';
import ProfileStack from '../../admin/profile-stack/ProfileStack.component';

type ProjectCardTypes = {
  img?: string;
  title?: string;
  contributors?: any;
  style?: object;
};

const ProjectCard: React.FC<ProjectCardTypes> = ({ img, title, contributors, style }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.img__container} style={style}>
      <img
        src={img ?? placeholder}
        alt='project image'
        style={{
          backgroundImage: `url(${img})`,
          opacity: img ? 1 : 0.5,
          borderTopRightRadius: '25px',
          borderTopLeftRadius: '25px',
          position: 'absolute',
          width: '220px',
          height: '260px',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        crossOrigin='anonymous'
      />
      <div className={styles.img__wrapper}>
        <div className={styles.images}>
          {contributors?.length > 0 && (
            <ProfileStack size={32} contributors={contributors} />
          )}
        </div>
        <div className={styles.titleText}>{title}</div>
      </div>
      <div className={styles.button}>
        <Button
          text='Learn more..'
          onClick={() => navigate('/')}
          bgColor='transparent'
          style={{ alignSelf: 'right', margin: '0', padding: '0' }}
        />
      </div>
    </div>
  );
};

export default ProjectCard;

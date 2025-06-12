import React from 'react';
import placeholder from '../../../assets/images/p-placeholder.jpg';
import { AttachFileIcon, ClockIcon, CommentIcon, ListIcon } from '../../../assets/svg';
import Profiles from '../profiles/Profiles.component';
import { ProjectCardTypes } from './Project.type';
import { months } from '../../../assets/data/months';
import eye from '../../../assets/images/eye.jpg';
import eyeStrike from '../../../assets/images/eye-strike.png';
import classes from './ProjectCard.module.css';
import Button from '../button/Button.component';
import { useAppSelector } from '../../../store';
import Spinner from '../../loaders/spinner/Spinner';
import profileClass from '../profiles/Profiles.module.css';
import Avatar from '../avatar/Avatar.component';
import ProfileStack from '../profile-stack/ProfileStack.component';

// isBoard is used to add or remove Items that are needed
// for a draggable component on the project details board

const dateMonth = new Date().getMonth();
const dateNow = new Date().getDate() + ' ' + months[dateMonth] + ' ' + new Date().getFullYear();

const ProjectCard = ({
  image,
  title = '',
  labels = [],
  percentage = 0,
  commentNum = 0,
  fileNum = 0,
  width,
  height,
  contributors,
  date = dateNow,
  completed = false,
  size,
  style,
  onClick,
  makeVisible,
  onEdit,
  visibleLoading,
  projectId,
  publicProject,
  isEditable,
}: ProjectCardTypes) => {
  const dateMonth = new Date(date);
  return (
    <div className={classes.container} style={{ width, height, ...style }}>
      <div onClick={isEditable ? onClick : () => null} className={classes.top}>
        <div style={{ textAlign: 'left' }}>
          <h5 className={classes.title}>{title}</h5>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {labels?.map((lab: any, index: any) => (
              <span key={`${lab} ${index}`} className={classes.caption}>
                {lab}
                {index !== labels.length - 1 && ','}
              </span>
            ))}
          </div>
        </div>
        <div className={classes.image}>
          <img
            src={image ?? placeholder}
            crossOrigin='anonymous'
            alt='cover'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '14px',
              opacity: image ? 1 : 0.12,
            }}
          />
        </div>
        <div className={classes.date}>
          <span>{date ?? dateMonth.toDateString() ?? dateNow}</span>
        </div>
        <div className={classes.progress}>
          <div className={classes.progressDetail}>
            <div>
              {percentage > 0 && <h5 className={classes.progressType}>In Progress</h5>}
              {percentage === 0 && <h5 className={classes.progressType}>New</h5>}
              {percentage === 100 && <h5 className={classes.progressType}>Completed</h5>}
            </div>
            <span className={classes.valueText} style={{ color: '#006557' }}>
              {percentage} %
            </span>
          </div>
          <div className={classes.progressBar}>
            <div
              className={classes.progressFill}
              style={{ width: completed ? '100%' : `${(percentage / 100) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className={classes.bottom}>
          <div className={classes.comment}>
            <CommentIcon style={{ marginRight: '5px' }} />
            {commentNum} comments
          </div>
          <div className={classes.comment}>
            <AttachFileIcon style={{ marginRight: '5px' }} />
            {fileNum} files
          </div>
          {contributors && (
            <ProfileStack contributors={contributors} />
          )}
        </div>
        {isEditable && (
          <div className={classes.bottom} style={{ margin: '10px 0 6px' }}>
            {visibleLoading ? (
              <Spinner size='13px' />
            ) : publicProject ? (
              <img
                src={eyeStrike}
                style={{ width: '12px', height: '12px', cursor: 'pointer' }}
                onClick={makeVisible}
                crossOrigin='anonymous'
              />
            ) : (
              <img
                src={eye}
                style={{ width: '16px', height: '20px', cursor: 'pointer' }}
                onClick={makeVisible}
                crossOrigin='anonymous'
              />
            )}

            <Button
              text='Edit'
              bgColor=''
              border=''
              color='#003B33'
              padding='0px'
              onClick={onEdit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

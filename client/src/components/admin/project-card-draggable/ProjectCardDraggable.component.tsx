import React, { useRef } from 'react';
import placeholder from '../../../assets/images/p-placeholder.jpg';
import { ListIcon } from '../../../assets/svg';
import Profiles from '../profiles/Profiles.component';
import { months } from '../../../assets/data/months';
import { ProjectCardTypes } from '../project-card/Project.type';
import classes from '../project-card/ProjectCard.module.css';
import profileClass from '../../admin/profiles/Profiles.module.css';
import { useDrag } from 'react-dnd';
import Avatar from '../avatar/Avatar.component';
import ProfileStack from '../profile-stack/ProfileStack.component';

const dateMonth = new Date().getMonth();
const dateNow = new Date().getDate() + ' ' + months[dateMonth] + ' ' + new Date().getFullYear();

const ProjectCardDraggable = ({
  image,
  name = 'Orphanage Volunteering',
  description,
  labels = [],
  percentage = 0,
  width,
  height,
  contributors,
  date = dateNow,
  completed = false,
  priority,
  style,
  size,
  // isDragging,
  index,
  id,
  onClick,
}: ProjectCardTypes) => {
  const dateTime = new Date(date);
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { type: 'card', id },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  return (
    <div
      ref={ref}
      className={`${classes.container} ${classes.draggable}`}
      style={{
        width,
        height,
        boxShadow: isDragging
          ? '0px 4px 10px rgba(0, 0, 0, 0.4)'
          : '0px 0px 10px rgba(0, 0, 0, 0.05)',
        ...style,
      }}
    >
      <div onClick={onClick}>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          {priority?.toLocaleLowerCase() === 'high' && (
            <div className={classes.priority} style={{ backgroundColor: '#00983D' }}>
              {priority}
            </div>
          )}
          {priority?.toLocaleLowerCase() === 'low' && (
            <div className={classes.priority} style={{ backgroundColor: '#FE4329' }}>
              {priority}
            </div>
          )}
          {priority?.toLocaleLowerCase() === 'medium' && (
            <div className={classes.priority} style={{ backgroundColor: '#FDBF47' }}>
              {priority}
            </div>
          )}
        </div>
        {image && (
          <div className={classes.image}>
            <img
              src={image ?? placeholder}
              alt='cover'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: '14px',
                opacity: image ? 1 : 0.12,
              }}
              crossOrigin='anonymous'
            />
          </div>
        )}
        <div
          style={{
            textAlign: 'left',
            marginBottom: !image ? '26px' : '16px',
            marginTop: !image ? '30px' : '',
          }}
        >
          <h5 className={classes.title}>{name}</h5>
          <span className={classes.caption}>{description}</span>
        </div>
        {!image && (
          <div
            className={classes.date}
            style={{
              border: '1px solid #E2E2E2',
              color: '#232360',
              background: !image ? '#ECEDEF' : 'transparent',
              fontWeight: '600',
            }}
          >
            <span style={{ fontSize: '10px' }}>{date ?? dateTime.toDateString() ?? dateNow}</span>
          </div>
        )}
        <div className={classes.progress} style={{ marginTop: !image ? '30px' : '' }}>
          <div className={classes.progressDetail}>
            <div>
              {percentage > 0 && (
                <h5 className={classes.progressType}>
                  <ListIcon style={{ marginRight: '10px' }} />
                  In Progress
                </h5>
              )}
              {percentage === 0 && (
                <h5 className={classes.progressType}>
                  <ListIcon style={{ marginRight: '4px' }} />
                  New
                </h5>
              )}
              {percentage === 100 && (
                <h5 className={classes.progressType}>
                  <ListIcon style={{ marginRight: '10px' }} />
                  Completed
                </h5>
              )}
            </div>
            <span className={classes.valueText} style={{ color: 'rgba(28, 29, 34, 0.5)' }}>
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
      <div
        className={classes.bottom}
        style={{ display: 'flex', justifyContent: image ? 'space-between' : 'flex-end' }}
      >
        {image && (
          <div
            className={classes.date}
            style={{
              border: '1px solid #E2E2E2',
              backgroundColor: 'transparent',
              color: '#232360',
            }}
          >
            <span style={{ fontSize: '10px' }}>{date ?? dateTime.toDateString() ?? dateNow}</span>
          </div>
        )}
        <ProfileStack contributors={contributors} />
      </div>
    </div>
  );
};

export default ProjectCardDraggable;

import React, { useEffect, useRef, useState } from 'react';
import { MoreVerticalIcon } from '../../../assets/svg';
import ProjectCard from '../project-card/ProjectCard';
import { projects as projectData } from '../../../assets/data/projects';
import { contributors } from '../../../assets/data/contributors';
import ProjectCardDraggable from '../project-card-draggable/ProjectCardDraggable.component';
import { useAppDispatch, useAppSelector } from '../../../store';
import { getProjectDetailsAction } from '../../../store/features/slices/projects/projects.action';
import Button from '../button/Button.component';
import classes from './ProjectColumn.module.css';
import { useDrop } from 'react-dnd';

interface ProjectColumnProps {
  title?: string;
  numOfItems?: string | number;
  onMore?: () => void;
  onAdd?: () => void;
  showTaskDetails?: (taskId: string) => void;
  onDeleteColumn?: () => void;
  tasks?: any;
  id?: string;
  draggableId?: string;
  droppableId?: string;
  changeTaskStatus: any;
  status: any;
  sections: any;
  deleteSectionLoading?: boolean;
}

const ProjectColumn = ({
  title = '',
  tasks,
  id = '',
  numOfItems = '',
  draggableId = '',
  droppableId = '',
  onMore,
  onAdd,
  showTaskDetails,
  onDeleteColumn,
  changeTaskStatus,
  status,
  sections,
  deleteSectionLoading,
}: ProjectColumnProps) => {
  const ref = useRef(null);

  const [{ isOver, highlighted }, drop] = useDrop({
    accept: 'card',
    drop(item: any) {
      changeTaskStatus(item, status, tasks, sections);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      highlighted: monitor.canDrop(),
    }),
  });

  drop(ref);

  const dispatch = useAppDispatch();
  const [actionsDelete, setActionsDropdown] = React.useState<boolean>(false);

  return (
    <div
      ref={ref}
      className={classes.container}
      style={{
        background: isOver ? 'rgba(255,255,255,0.5)' : '',
        border: highlighted ? '1px solid #fff' : '',
      }}
    >
      <div className={classes.heading}>
        <span className={classes.headingTitle}>
          {title} {`(${numOfItems})`}
        </span>
        <div className={classes.actionButtons}>
          <MoreVerticalIcon
            size='18px'
            color='#868686'
            style={{ transform: 'rotate(90)' }}
            onClick={() => setActionsDropdown(!actionsDelete)}
          />
          <div
            className={classes.addIcon}
            onClick={onAdd}
            style={{ margin: actionsDelete ? '0 5px 0 9px' : '' }}
          >
            +
          </div>
          {actionsDelete && (
            <div className={classes.actionsDelete}>
              <Button
                onClick={onDeleteColumn}
                text='Delete'
                border=''
                bgColor=''
                color='red'
                fillColor='red'
                strokeColor='#fff'
                spinnerSize='10px'
                loading={deleteSectionLoading}
                padding='0'
              />
            </div>
          )}
        </div>
      </div>
      <div>
        {tasks
          ?.filter((task: any) => task?.section?._id === id)
          .slice(0)
          .reverse()
          .map((item: any) => {
            return (
              <ProjectCardDraggable
                key={item?._id}
                id={item?._id}
                style={{ margin: '0', marginBottom: '30px' }}
                priority={item?.priority}
                contributors={item.assignees}
                description={item?.description}
                percentage={
                  item.subTaskTotal !== 1
                    ? item?.subTaskTotal === 0
                      ? 0
                      : (item?.subTaskCompleted / item?.subTaskTotal) * 100
                    : 1
                }
                name={item?.name}
                image={item.files?.[0]?.httpPath}
                date={item?.date}
                onClick={() => {
                  showTaskDetails?.(item?._id);
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ProjectColumn;

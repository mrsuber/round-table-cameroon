import React, { ChangeEvent, ReactNode } from 'react';
import classes from './KanbanLoading.module.css';

interface IProps {
  kanbanLoading?: boolean;
  children?: ReactNode | any;
  contentStyle?: object
  containerStyle?: object
}

const KanbanLoading = ({ kanbanLoading, children, contentStyle, containerStyle }: IProps) => {
  return (
    <>
      {kanbanLoading && (
        <div className={classes.container} style={containerStyle}>
          <div className={classes.content} style={contentStyle}>{children}</div>
        </div>
      )}
    </>
  );
};

export default KanbanLoading;

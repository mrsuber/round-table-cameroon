import React from 'react';
import Button from '../button/Button.component';
import classes from './DeleteModal.module.css'

interface IProps {
  onDelete: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const DeleteModal = ({ onDelete, onCancel, loading }: IProps) => {
  return (
    <div className={classes.container}>
      <span style={{ fontSize: '12px' }}>Are you sure you want to Delete?</span>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '15px 0 0' }}>
        <Button
          text='Yes'
          onClick={onDelete}
          color='red'
          border='1px solid red'
          bgColor=''
          width='100%'
          margin='0 10px 0 0'
          loading={loading}
          spinnerSize='16px'
          fillColor='red'
        />
        <Button text='Cancel' onClick={onCancel} width='100%' />
      </div>
    </div>
  );
};

export default DeleteModal;

import React, { ChangeEvent } from 'react';
import classes from './AddColumn.module.css';
import Input from '../input/Input.component';
import Button from '../button/Button.component';
import { CloseIcon } from '../../../assets/svg';

interface IProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onClick?: () => void;
  onClose?: () => void;
  showModal?: boolean;
  columnLoading?: boolean;
}

const AddColumn = ({
  placeholder,
  value,
  onChange,
  showModal,
  onClick,
  onClose,
  columnLoading,
}: IProps) => {
  return (
    <>
      {showModal && (
        <div className={classes.container}>
          <div className={classes.content}>
            <div className={classes.close}>
              <CloseIcon onClick={onClose} />
            </div>
            <Input placeholder={placeholder} value={value} onChange={onChange} />
            <Button text='Add Column' onClick={onClick} margin='16px 0 0' loading={columnLoading} spinnerSize='14px' />
          </div>
        </div>
      )}
    </>
  );
};

export default AddColumn;

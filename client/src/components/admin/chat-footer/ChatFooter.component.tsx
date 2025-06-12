import React, { useState, useEffect } from 'react';
import classes from './ChatFooter.module.css';
import Input from '../input/Input.component';
import { AttachmentIcon, SendIcon } from '../../../assets/svg';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface IProps {
  onSend: () => void;
  onEmojiSelect: (emj: any) => void;
  onFileSelect?: any;
  onTextChange: any;
  value: string;
  placeholder?: any;
  onKeyDown?: any;
}

const ChatFooter = ({
  onSend,
  onFileSelect,
  onTextChange,
  onEmojiSelect,
  value,
  placeholder,
  onKeyDown,
}: any) => {
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);

  const mouseE = () => {
    if (isPickerVisible) {
      setIsPickerVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', mouseE);
    return () => document.removeEventListener('mousedown', mouseE);
  });
  
  useEffect(() => {
    const keyDownHandler = (event: any) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onSend?.();
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  });
  return (
    <>
      {isPickerVisible && (
        <div className={classes.coverPreviews} style={{ right: '10rem' }}>
          <Picker
            data={data}
            previewPosition='none'
            onEmojiSelect={(e: any) => {
              onEmojiSelect?.(e.native);
              setIsPickerVisible(!isPickerVisible);
            }}
          />
        </div>
      )}
      <div className={classes.chatInput}>
        <Input
          placeholder={placeholder}
          onChange={onTextChange}
          value={value}
          onKeyDown={onKeyDown}
          renderIcon={() => (
            <div
              onClick={() => setIsPickerVisible(!isPickerVisible)}
              style={{ fontSize: '16px', cursor: 'pointer' }}
            >
              😀
            </div>
          )}
        />
        <input
          id='upload'
          type='file'
          style={{ display: 'none' }}
          accept='image/*'
          onChange={onFileSelect}
        />
        <div className={classes.inputActions}>
          <label htmlFor='upload'>
            <AttachmentIcon size='18' style={{ cursor: 'pointer' }} />
          </label>
          <div className={classes.sendIcon} onClick={onSend}>
            <SendIcon size='11' />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatFooter;

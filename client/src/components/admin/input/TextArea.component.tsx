import React from 'react';
import classes from './Input.module.css';
import { InputTypes } from './Input.type';

interface textAreaProps {
  width?: string;
  height?: string;
  placeholder?: string;
  value?: string;
  style?: object;
  onChange?: any;
}

const TextArea = ({
  width = '100%',
  height = '110px',
  placeholder,
  value,
  onChange,
  style,
  label,
  labelStyle,
  padding,
  margin
}: InputTypes) => {
  return (
    <div style={{ margin }}>
      {label && (
        <div className={classes.label} style={labelStyle}>
          {label}
        </div>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={classes.textArea}
        style={{ width, height, padding, ...style }}
      />
    </div>
  );
};

export default TextArea;

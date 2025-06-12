import React from 'react';
import { InputTypes } from './Input.type';
import classes from './Input.module.css';

const Input = ({
  inputStyle,
  containerStyle,
  hasError,
  onChange,
  renderIcon,
  renderIconLeft,
  placeholder,
  errorMessage,
  width = '100%',
  margin = '',
  label,
  type,
  value,
  children,
  iconAfter,
  outerPadding = '0 10px 0 0',
  padding = '10px',
  labelStyle,
  color,
  fontWeight,
  border = '1px solid #dfe1e6',
  onFocus,
  onBlur,
  ...props
}: InputTypes) => (
  <div style={{ margin, width, ...containerStyle, ...props }}>
    {label && (
      <div className={classes.label} style={labelStyle}>
        {label}
      </div>
    )}
    <div
      className={classes.inputContainer}
      style={{
        backgroundColor: hasError ? 'red' : color,
        width,
        padding: outerPadding,
        border,
      }}
    >
      {(iconAfter && renderIcon?.()) ?? renderIconLeft?.()}
      <input
        className={classes.styledInput}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        style={inputStyle ?? { padding, fontWeight }}
      />
      {!iconAfter && renderIcon?.()}
      {children}
    </div>
    <div style={{ display: 'flex' }}>
      {(hasError || errorMessage) && <span className={classes.errorMessage}>{errorMessage}</span>}
    </div>
  </div>
);

export default Input;

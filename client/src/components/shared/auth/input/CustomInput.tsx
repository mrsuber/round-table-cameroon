import React from 'react';

import styles from './custominput.module.css';

type Props = {
  placeholder: string;
  icon?: JSX.Element;
  left?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  // eslint-disable-next-line
  value?: any;
  type?: string;
  iconRight?: JSX.Element;
  containsBorder?: boolean;
  border?: string;
  height?: string;
  error?: string;
  hasError?: boolean;
};

const CustomInputField: React.FC<Props> = ({
  placeholder,
  icon,
  left,
  onChange,
  name,
  value,
  type,
  iconRight,
  containsBorder,
  border,
  height,
  error,
}) => {
  return (
    <>
      <div
        className={styles.container}
        style={{ border: error ? '1px solid red' : '', marginBottom: error ? '6px' : '1.6rem' }}
      >
        <input
          value={value}
          name={name}
          type={type}
          onChange={onChange}
          className={`${styles.input} ${left ? styles.left : ''}`}
          placeholder={placeholder}
          style={{
            border: containsBorder ? border : 'none',
            background: containsBorder ? 'none' : '#f4f4f1',
            borderRadius: containsBorder ? '5px' : 'none',
            height: height ?? '',
          }}
        />
        <span className={styles.icon}>{icon}</span>
        <span className={styles.icon__right}>{iconRight}</span>
      </div>
      {error && <p className={styles.error__Msg}>{error}</p>}
    </>
  );
};

export default CustomInputField;

import { ChangeEvent, ReactNode } from 'react';

export interface InputTypes {
  [key: string]: any;
  hasError?: boolean;
  disabled?: boolean;
  inputStyle?: object;
  containerStyle?: object;
  className?: string;
  name?: string;
  label?: string;
  type?: string;
  border?: string;
  errorMessage?: string;
  noBorder?: boolean;
  labelStyle?: object;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  placeholder?: string;
  width?: string;
  margin?: string;
  padding?: string;
  outerPadding?: string;
  renderIcon?: () => ReactNode;
  renderIconLeft?: () => ReactNode;
  children?: ReactNode | ReactNode[];
  iconAfter?: boolean;
  value?: string;
  fontWeight?: string;
  onFocus?: any
  onBlur?: any
}

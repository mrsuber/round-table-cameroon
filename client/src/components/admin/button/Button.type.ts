import { ReactNode } from 'react';

export interface ButtonTypes {
  bgColor?: string;
  color?: string;
  padding?: string | number;
  margin?: string | number;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: object;
  border?: string | number;
  fontSize?: string | number;
  children?: ReactNode | ReactNode[];
  onClick?: (e?: any) => void;
  renderIcon?: () => ReactNode;
  text?: string;
  iconAfter?: boolean;
  textMargin?: string;
  disabled?: boolean;
  boxShadow?: string;
  textStyle?: object;
  loading?: boolean;
  spinnerSize?: string;
  fillColor?: string;
  strokeColor?: string;
}

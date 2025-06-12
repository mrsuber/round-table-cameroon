import { ChangeEvent } from 'react';

export interface LayoutTypes {
  children: React.ReactNode | React.ReactNode[];
  title?: string;
  showNavbar?: boolean;
  padding?: string;
  margin?: string;
  bgColor?: string;
  inlineWidth?: string;
  contributors?: any
  onChange?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  searchValue?:string
  adminMarginTop?: string
  actionText?: string
  onClick?: () => void
  onDeleteProject?: () => void;
  onGoBack?: () => void;
  deleteText?: string
  showDelete?: boolean;
  childBackground?: string
  size?: string
  showBack?: boolean
}

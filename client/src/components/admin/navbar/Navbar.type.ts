import { ChangeEvent } from 'react';

export interface NavbarTypes {
  username?: string;
  date?: string;
  handleLogout?: () => void;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  searchValue?:string
}

import { UserDataType } from '../types';

export interface AuthType {
  loading?: boolean;
  user?: UserDataType | any;
  error?: any;
  sender?: string;
  receiver?: string;
}
export interface ChatType extends BaseResponseType {
  chats?: any;
  chatUsers?: any;
  receiver: string;
  sender: string;
  usersMessages?: any
}
export interface BaseResponseType {
  loading?: boolean;
  error?: any;
  payload?: any;
  succesMessage?: string
  projectError?: any
}
export interface ContactFormType {
  fullNames: string;
  email: string;
  message: string;
}
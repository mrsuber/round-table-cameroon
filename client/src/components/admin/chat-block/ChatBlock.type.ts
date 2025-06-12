export interface ChatBlockTypes {
  children?: React.ReactNode | React.ReactNode[];
  message?: string;
  sending?: boolean;
  time?: string;
  images?: any;
  style?: object;
  files?: any;
  date?: any;
  isNowDate?: boolean;
  serverImages?: any;
  sent?: boolean;
  isDrop?: boolean;
  onDropClick?: () => void;
  onCheckForward?: () => void;
  onActionClick?: (item: any) => void;
  dropStyle?: object;
  isForwarding?: boolean;
  toForward?: boolean;
}

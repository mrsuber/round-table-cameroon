export interface avatarTypes {
  src?: string;
  bgColor?: string;
  onClick?: () => void;
  padding?: string | number;
  margin?: string | number;
  size?: string | number;
  borderRadius?: string | number;
  style?: object;
  imageStyle?: object;
  border?: string | number;
  detailsMargin?: string | number;
  paddingLeft?: string | number;
  username?: string;
  verified?: boolean;
  renderButton?: () => React.ReactNode;
  id?: string;
}

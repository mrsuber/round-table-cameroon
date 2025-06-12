import { ReactNode } from 'react';

export interface DropdownTypes {
  label?: string;
  id?: string;
  id2?: string;
  options?: any;
  handleOption?: (item: string) => void;
  onHeaderClick?: () => void;
  style?: object;
  renderIconLeft?: () => ReactNode;
  renderIconRight?: () => ReactNode;
  text?: string;
  headerStyle?: object;
  textStyle?: object;
  dropdownItemsStyle?: object;
  nullCheckValue?: boolean;
  errorText?: string;
  headerRef?: any;
  children?: ReactNode | ReactNode[];
  region?: string;
  initialValue?: string;
  isDropdown?: boolean;
  dropItemsStyle?: object
}

import { ColumnType } from '../../../utils/enums';

export interface ProjectCardTypes {
  image?: string;
  title?: string;
  name?: string;
  description?: string;
  labels?: string[];
  percentage?: number;
  commentNum?: number | string;
  fileNum?: number | string;
  width?: string;
  height?: string;
  date?: string;
  size?: string;
  inProgress?: boolean;
  completed?: boolean;
  publicProject?: boolean;
  style?: object;
  visibleLoading?: boolean;
  priority?: 'high' | 'medium' | 'low';
  onClick?: () => void;
  onEdit?: () => void;
  makeVisible?: () => void;
  isDragging?: boolean;
  contributors?: {
    id?: string;
    image?: string;
    name?: string;
  }[];
  column?: ColumnType
  index?: any
  id?: number | string
  projectId?: string;
  isEditable?: boolean // checks whether data is editable
}

export interface NotificationItemTypes {
  title?: string
  caption?: string
  onChange: (
    checked: boolean,
    event: MouseEvent | React.SyntheticEvent<MouseEvent | KeyboardEvent, Event>,
    id: string,
  ) => void
  checked?: boolean
  id?: string
}

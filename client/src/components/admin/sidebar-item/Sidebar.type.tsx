export interface SidebarTypes {
  text?: string
  renderIcon?: () => React.ReactNode
  onClick?: () => void
  active?: boolean
  style?: object
  to?: any
  children?: React.ReactNode
  activeClassName?: string
  fontSize?: string
}

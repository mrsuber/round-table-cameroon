import React from 'react'
import { SidebarTypes } from './Sidebar.type'
import { NavLink } from 'react-router-dom'
import classes from './SidebarItem.module.css'

const SidebarItem = ({
  renderIcon,
  text,
  activeClassName = classes.activeContainer,
  to,
  style,
  fontSize = '14px',
}: SidebarTypes) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        isActive ? `${activeClassName} ${classes.container}` : classes.container
      }
      style={style}
    >
      {renderIcon?.()}
      <span style={{ marginLeft: renderIcon && '14px', fontSize }}>{text}</span>
    </NavLink>
  )
}

export default SidebarItem

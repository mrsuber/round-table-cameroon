import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SidebarItem from '../sidebar-item/SidebarItem.component'
import { settingsSidebar, sidebar } from '../../../assets/data/sidebar'
import classes from './SettingsMobileNavs.module.css'

interface sidebarProps {
  showSidebar?: boolean
  onClick?: () => void
}

const SettingsMobileNavs = ({ showSidebar, onClick }: sidebarProps) => {
  const [active, setActive] = useState<string>('')
  const navigate = useNavigate()
  return (
    <>
      {showSidebar && (
        <div className={classes.container}>
          {settingsSidebar.map((item: any) => (
            <SidebarItem
              key={item.id}
              text={item.title}
              activeClassName={classes.activeItem}
              style={{
                backgroundColor: 'white',
                borderRadius: ' 25px',
                display: 'flex',
                marginBottom: '18px',
                padding: '6px 8px',
                fontWeight: '600',
                fontSize: '16px',
              }}
              renderIcon={() => (
                <div className={classes.icon}>
                  <item.icon color={item.title === active ? '#00262a' : '#929283'} size='24' />
                </div>
              )}
              to={item.path}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default SettingsMobileNavs

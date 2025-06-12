import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SidebarItem from '../sidebar-item/SidebarItem.component'
import { sidebar } from '../../../assets/data/sidebar'
import { CloseIconOutlined, Logo } from '../../../assets/svg'
import classes from './MobileSidebar.module.css'

interface sidebarProps {
  showSidebar?: boolean
  onClose?: () => void
}

const MobileSidebar = ({ showSidebar, onClose }: sidebarProps) => {
  const [active, setActive] = useState<string>('')
  const navigate = useNavigate()
  return (
    <>
      {showSidebar && (
        <div className={classes.container}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #fff',
              padding: '20px',
            }}
          >
            <Logo />
            <CloseIconOutlined onClick={onClose} />
          </div>
          <div style={{ marginTop: '30px', padding: '0 35px' }}>
            {sidebar.map((item: any) => (
              <SidebarItem
                key={item.id}
                text={item.title}
                renderIcon={() => (
                  <item.icon color={item.title === active ? '#00262a' : '#929283'} size='18' />
                )}
                to={item.path}
                style={{ margin: '10px 0', padding: '20px 14px' }}
                fontSize='18px'
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default MobileSidebar

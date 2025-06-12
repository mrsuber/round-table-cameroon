import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsSidebar } from '../../../assets/data/sidebar';
import SidebarItem from '../sidebar-item/SidebarItem.component';
import classes from './SettingsSidebar.module.css';

interface sidebarProps {
  width?: string;
}

const SettingsSidebar = ({ width }: sidebarProps) => {
  const [active, setActive] = useState<string>('General');
  const navigate = useNavigate();
  return (
    <div className={classes.container} style={{ width }}>
      <div>
        {settingsSidebar.map((item: any) => (
          <SidebarItem
            key={item.id}
            text={item.title}
            to={item.path}
            activeClassName={classes.activeItem}
            style={{
              backgroundColor: 'white',
              borderRadius: ' 25px',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '18px',
              padding: '8px 10px',
              fontWeight: '600',
            }}
            fontSize='12px'
          />
        ))}
      </div>
    </div>
  );
};

export default SettingsSidebar;

import { useEffect, useState } from 'react';
import SidebarItem from '../sidebar-item/SidebarItem.component';
import { sidebar } from '../../../assets/data/sidebar';
import { Logo } from '../../../assets/svg';
import HelpCard from '../help-card/HelpCard.component';
import classes from './Sidebar.module.css';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../routers/paths';

interface sidebarProps {
  width?: string;
}

const Sidebar = ({ width }: sidebarProps) => {
  const [active, setActive] = useState<string>('Dashboard');
  const navigate = useNavigate();
  return (
    <div className={classes.container} style={{ width }}>
      <div className={classes.logo}>
        <Logo onClick={() => navigate(paths.HOME)} />
        <span className={classes.rtText}>Round-Table Cameroon</span>
      </div>
      <div className={classes.belowLogo}>
        <div style={{ margin: '4rem 0px 6rem' }}>
          {sidebar.map((item: any) => (
            <SidebarItem
              key={item.id}
              text={item.title}
              onClick={() => setActive(item.title)}
              renderIcon={() => (
                <item.icon color={item.title === active ? '#00262a' : '#929283'} size='18' />
              )}
              to={item.path}
            />
          ))}
        </div>
        <HelpCard />
      </div>
    </div>
  );
};

export default Sidebar;

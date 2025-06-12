import { useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UseScrollPosition } from '../../../lib/hooks/ScrollView';
import { navlinks, paths } from '../../../routers/paths';
import Button from '../../admin/button/Button.component';
import { toast } from 'react-toastify';
import logo from '../../../assets/images/labelling_logo.png';
import styles from './navbar.module.css';

const PreviewNavBar = ({ style, logoImage, themeColor='#036E67' }: { style?: object; logoImage?: string, themeColor?: string }) => {
  const ref = useRef(toast);
  const pos = UseScrollPosition();
  const navigate = useNavigate();

  const handleAuth = () => {
    navigate(paths.AUTH);
  };

  return (
    <div className={`${styles.main__container} ${pos > 100 ? styles.shadow : ''}`} style={style}>
      <div style={{ width: '100px', height: '40px' }}>
        <Link to='/labelling/home'>
          <img
            src={logoImage || logo}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Link>
      </div>
      <div className={styles.nav__content}>
        <div className={styles.navlinks} style={{ paddingRight: '0' }}>
          {navlinks.map((link, index: number) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? `${styles.nav_links} ${styles.activeLink}` : `${styles.nav_links}`
              }
              key={link.path}
              to={link.path}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <Button text='Sign up' padding='10px' bgColor={themeColor} />
        <Button
          text='Sign In'
          padding='10px'
          style={{ border: `1px solid ${themeColor}`, marginLeft: '10px' }}
          bgColor='transparent'
          color={themeColor}
        />
      </div>
    </div>
  );
};

export default PreviewNavBar;

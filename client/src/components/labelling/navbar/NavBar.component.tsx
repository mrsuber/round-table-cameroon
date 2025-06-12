import  {useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UseScrollPosition } from '../../../lib/hooks/ScrollView';
import { labellingNavlinks, paths } from '../../../routers/paths';
import styles from './navbar.module.css';
import Button from '../../admin/button/Button.component';
import { ArrowDownIcon } from '../../../assets/svg';
import { toast } from 'react-toastify';
import logo from '../../../assets/images/labelling_logo.png';

const NavBar = () => {
  const ref = useRef(toast);
  const pos = UseScrollPosition();
  const navigate = useNavigate();

  const handleAuth = () => {
    navigate(paths.AUTH);
  };

  return (
    <div className={`${styles.main__container} ${pos > 100 ? styles.shadow : ''}`}>
      <div style={{ width: '100px', height: '40px' }}>
        <Link to='/'>
          <img src={logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Link>
      </div>
      <div className={styles.nav__content}>
        <div className={styles.navlinks}>
          {labellingNavlinks.map((link, index: number) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? `${styles.nav_links} ${styles.activeLink}` : `${styles.nav_links}`
              }
              key={link.path}
              to={link.path}
            >
              {link.label}
              {index > 1 && <ArrowDownIcon width='15' height='7' style={{ marginLeft: '10px' }} />}
            </NavLink>
          ))}
        </div>
        <Button text='Book Consultant' onClick={handleAuth} padding='10px 10px' bgColor='#036E67' />
      </div>
    </div>
  );
};

export default NavBar;

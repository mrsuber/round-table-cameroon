import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Arrow from '../../../icons/Arrow';

import Logo from '../../../icons/Logo';
import { UseScrollPosition } from '../../../lib/hooks/ScrollView';
import { navlinks, paths } from '../../../routers/paths';
// import Button from '../button/Button';

import { useAppDispatch, useAppSelector } from '../../../store';
import Avatar from '../../admin/avatar/Avatar.component';
import placeholder from '../../../assets/images/placeholer.png';
import styles from './navbar.module.css';
import Button from '../../admin/button/Button.component';
import { ArrowRightIcon, ChevronRightIcon } from '../../../assets/svg';
import { toast } from 'react-toastify';
import { persistor } from '../../..';

const NavBar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.members);

  const ref = useRef(toast);
  const pos = UseScrollPosition();
  const navigate = useNavigate();

  const handleAuth = () => {
    navigate(paths.AUTH);
  };
  const handleDashboardNavigate = () => {
    if (user?.user?.isMember === false) {
      ref.current.warning('Not a Member 🚫, Get Approved by Admin first');
      return;
    }
    navigate(paths.ADMIN.DASHBOARD);
  };

  return (
    <div className={`${styles.main__container} ${pos > 100 ? styles.shadow : ''}`}>
      <div>
        <Link to='/'>
          <Logo style={{ width: '40' }} />
        </Link>
      </div>
      <div className={styles.nav__content}>
        <div className={styles.navlinks}>
          {navlinks.map((link) => (
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
        {user?.accessToken ? (
          <div className={styles.user__profile}>
            <Avatar
              size='32px'
              src={profile?.profileImage?.httpPath ?? placeholder}
              onClick={handleDashboardNavigate}
              border='1px solid #005259'
            />
          </div>
        ) : (
          <>
            <Link to='/auth?tab=signup' style={{ textDecoration: 'none' }}>
              <Button
                text='Join Our Community'
                style={{ marginRight: '15px', border: '1px solid #005259' }}
                renderIcon={() => (
                  <ArrowRightIcon style={{ width: '14', height: '12', marginLeft: '5px' }} />
                )}
                iconAfter
                padding='13px 20px'
              />
            </Link>
            <Button
              text='Sign In'
              onClick={handleAuth}
              padding='13px 20px'
              style={{ border: '1px solid #005259' }}
              bgColor='transparent'
              color='#005259'
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;

import React from 'react';
import Navbar from '../components/admin/navbar/Navbar';
import Sidebar from '../components/admin/sidebar/Sidebar';
import { LayoutTypes } from './Layout.type';
import { useAppSelector } from '../store';
import profileClass from '../components/admin/profiles/Profiles.module.css';
import Button from '../components/admin/button/Button.component';
import classes from './Layout.module.css';
import placeholder from '../assets/images/placeholer.png';
import ProfileStack from '../components/admin/profile-stack/ProfileStack.component';
import { ArrowLeftIcon } from '../assets/svg';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({
  children,
  margin,
  padding = '8vh 12px 10px 4px',
  title,
  bgColor,
  contributors,
  onChange,
  showNavbar = true,
  adminMarginTop = '6vh',
  searchValue,
  actionText,
  onClick,
  onDeleteProject,
  deleteText,
  childBackground,
  showDelete,
  showBack = true,
  size = '26px',
}: LayoutTypes) => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div className={classes.adminContainer} style={{ marginTop: adminMarginTop }}>
      <Sidebar width='14%' />
      <div className={classes.adminContent} style={{ background: bgColor }}>
        {showNavbar && (
          <Navbar username={user?.user?.lastName} searchValue={searchValue} onChange={onChange} />
        )}
        <div
          className={classes.adminChildren}
          style={{ margin, padding, backgroundColor: childBackground }}
        >
          <div className={classes.headerContainer}>
            <div className={classes.headerBack} onClick={() => (showBack ? navigate(-1) : null)}>
              {showBack && <ArrowLeftIcon />}
              {title && <h2 className={classes.title}>{title}</h2>}
            </div>
            {actionText && (
              <div className={classes.actionButtons}>
                <Button text={actionText} onClick={onClick} />
                {showDelete && (
                  <Button
                    text={deleteText}
                    onClick={onDeleteProject}
                    style={{ marginLeft: '10px' }}
                    border='1px solid red'
                    color='red'
                    bgColor=''
                  />
                )}
              </div>
            )}
          </div>
          {contributors && (
            <div className={classes.contributors}>
              <p className={classes.contibutorText}>contributors</p>
              <ProfileStack size={32} contributors={contributors} style={{ marginRight: '15px' }} />
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

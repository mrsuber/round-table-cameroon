import { useCallback, useEffect, useRef, useState } from 'react';
import Avatar from '../avatar/Avatar.component';
import Notification from '../notification/Notification';
import { NavbarTypes } from './Navbar.type';
// import { HamburgerIcon } from '../../../assets/svg'
import MobileSidebar from '../mobile-sidebar/MobileSidebar.component';
import HamburgerIcon from '../../../assets/svg/HamburgerIcon';
import { useAppDispatch, useAppSelector } from '../../../store';
import { logoutUser } from '../../../store/features/slices/auth/auth.slice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../routers/paths';
import HeaderDropdown from '../header-dropdown/HeaderDropdown.component';
import { CalenderIcon, SearchIcon } from '../../../assets/svg';
import Input from '../input/Input.component';
import classes from './Navbar.module.css';
import 'react-calendar/dist/Calendar.css';
import { months } from '../../../assets/data/months';

const Navbar = ({ username = '', date = '', onChange, searchValue }: NavbarTypes) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { profile } = useAppSelector((state) => state.members);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [value, setValue] = useState<any>(new Date());
  const [dateValue, setDateValue] = useState<any>('');
  const calenderRef = useRef<boolean>(false);

  useEffect(() => {
    const dateMonth = value.getMonth();
    const dateNow = value.getDate() + ' ' + months[dateMonth] + ' ' + value.getFullYear();
    setDateValue(dateNow);
  }, [value]);

  return (
    <>
      <div className={classes.container}>
        {<h2 className={classes.title}>{`Welcome back, ${username} 👋`}</h2>}
        <div className={classes.hamburgerIcon}>
          <HamburgerIcon onClick={() => setShowSidebar(true)} />
        </div>
        <div className={showSearch ? classes.navItemsShow : classes.navItems}>
          {showSearch && (
            <div className={classes.searchInput}>
              <Input margin='0' onChange={onChange} placeholder='search' value={searchValue} />
            </div>
          )}
          <div className={classes.navItemsSub}>
            <>
              <div className={classes.search}>
                <SearchIcon onClick={() => setShowSearch(!showSearch)} />
              </div>
              <div className={classes.mobileSearch}>
                <SearchIcon onClick={() => setShowSearch(!showSearch)} color='#fff' size='14' />
              </div>
            </>
            <>
              <div className={classes.notification}>
                <Notification />
              </div>
              <div className={classes.mobileNotification}>
                <Notification color='#fff' size='14' />
              </div>
            </>
            <div className={showSearch ? `${classes.calenderHide} ${classes.calender}`: classes.calender}>
              <>
                <div className={classes.calIcon}>
                  <CalenderIcon />
                </div>
                <div className={classes.mobileCalIcon}>
                  <CalenderIcon color='#fff' size='12' />
                </div>
              </>
              <span className={classes.calValue}>{dateValue}</span>
            </div>
            <Avatar
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
              src={profile?.profileImage?.httpPath}
            />
          </div>
        </div>
        <HeaderDropdown showDropdown={showDropdown} />
      </div>
      <MobileSidebar showSidebar={showSidebar} onClose={() => setShowSidebar(!showSidebar)} />
    </>
  );
};

export default Navbar;

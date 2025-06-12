import { useNavigate } from 'react-router-dom';
import Button from '../button/Button.component';
import classes from './HeaderDropdown.module.css';
import BackwardArrow from '../../../icons/BackwardArrow';
import { paths } from '../../../routers/paths';
import { useAppDispatch } from '../../../store';
import { useCallback } from 'react';
import { logoutUser } from '../../../store/features/slices/auth/auth.slice';
import { toast } from 'react-toastify';

interface IProps {
  showDropdown?: boolean;
  style?: object;
}

const HeaderDropdown = ({ showDropdown, style }: IProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    toast.success('Logged Out!');
    navigate(paths.AUTH);
  }, [dispatch]);
  
  return (
    <>
      {showDropdown && (
        <div className={classes.dropdown} style={style}>
          <Button text='Logout' onClick={handleLogout} margin='0px 0 5px' />
          <Button
            text='Back To Home'
            color='#003B33'
            bgColor='#fff'
            onClick={() => navigate(paths.HOME)}
            renderIcon={() => <BackwardArrow />}
          />
        </div>
      )}
    </>
  );
};

export default HeaderDropdown;

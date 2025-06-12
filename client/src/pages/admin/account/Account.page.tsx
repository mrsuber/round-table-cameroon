import React, { useState } from 'react';
import Button from '../../../components/admin/button/Button.component';
import Input from '../../../components/admin/input/Input.component';
import SettingsLayout from '../../../layouts/Settings.layout';
import classes from './Account.module.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import { changePasswordAction } from '../../../store/features/slices/auth/auth.action';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../routers/paths';

const Account = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword) return toast.error('Please fill all the fields');
    else if (oldPassword !== newPassword) return toast.error('Old and New Passwords are not same');
    else {
      setLoading(true);
      const data = {
        token: user.accessToken,
        userData: {
          oldPassword,
          newPassword,
        },
      };
      dispatch(changePasswordAction(data))
        .then(() => {
          toast.success('Password changed succesfully');
          setLoading(false);
        })
        .catch((err) => toast.error(err.message));
    }
  };
  return (
    <SettingsLayout inlineWidth='90%'>
      <div className={classes.container}>
        <div className={classes.emailText}>
          <h4 className={classes.headings}>Public Email</h4>
          <span style={{ fontSize: '14px' }}>
            Your Email is:{' '}
            <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>{user?.user.email}</span>
          </span>
        </div>
        <div className={classes.passwordHeading}>
          <h4 className={classes.headings}>Password</h4>
          <span style={{ color: '#0555F0', fontSize: '13px', cursor: 'pointer' }}>Hide</span>
        </div>
        <div className={classes.passwords}>
          <div className={classes.passInputLeft}>
            <Input
              label='Current Password'
              placeholder='Enter Current Password'
              padding='5px 8px'
              borderRadius='8px'
              labelStyle={{ textAlign: 'left' }}
              margin='0 8px 0 0'
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className={classes.passInputRight}>
            <Input
              label='New Password'
              placeholder='Enter New Password'
              padding='5px 8px'
              labelStyle={{ textAlign: 'left' }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div style={{ fontSize: '13px', display: 'flex' }}>
          <div>Can’t remember your password?</div>
          <div
            style={{ color: '#0555F0', cursor: 'pointer', marginLeft: '10px' }}
            onClick={() => navigate(paths.FORGOTPASSWORD)}
          >
            Reset your password
          </div>
        </div>
        <div className={classes.save}>
          <Button
            text='Save Changes'
            width='100%'
            onClick={handlePasswordChange}
            loading={loading}
          />
        </div>
        <div className={classes.deleteAccount}>
          <h4 className={classes.headings}>Delete Account</h4>
          <p>
            Would you like to delete your account? Deleting your account will remove all the content
            associated with it!
          </p>
          <p className={classes.delete}>I want to delete my account</p>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default Account;

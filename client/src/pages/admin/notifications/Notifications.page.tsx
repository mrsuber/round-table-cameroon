import React, { useState } from 'react';
import Button from '../../../components/admin/button/Button.component';
import NotificationItem from '../../../components/admin/notification-item/NotificationItem.component';
import SettingsLayout from '../../../layouts/Settings.layout';
import classes from './Notifications.module.css';
import {
  getProfileAction,
  updateNotificationSettingsAction,
} from '../../../store/features/slices/members/members.action';
import { useAppDispatch, useAppSelector } from '../../../store';
import { toast } from 'react-toastify';

const Notifications = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.members);
  const dispatch = useAppDispatch();

  const [newsCheck, setNewsCheck] = useState(
    profile?.notificationSettings?.dailyNewsletter ?? false,
  );
  const [messageCheck, setMessageCheck] = useState(profile?.notificationSettings?.message ?? false);
  const [updateCheck, setUpdateCheck] = useState(
    profile?.notificationSettings?.projectUpdate ?? false,
  );
  const [deadlineCheck, setDeadlineCheck] = useState(
    profile?.notificationSettings?.projectDeadline ?? false,
  );
  const [loading, setLoading] = useState(false);

  const handleNotificationUpdate = () => {
    const data = {
      content: {
        dailyNewsletter: newsCheck,
        message: messageCheck,
        projectUpdate: updateCheck,
        projectDeadline: deadlineCheck,
      },
      token: user?.accessToken,
    };
    setLoading(true);
    dispatch(updateNotificationSettingsAction(data))
      .then((res: any) => {
        const { payload } = res;
        console.log(payload);
        if (Array.isArray(payload?.errors)) {
          payload?.errors.forEach((err: any) => {
            toast.error(err);
          });
          return;
        }
        toast.success(payload?.message);
        dispatch(getProfileAction(user?.accessToken));
      })
      .catch((err: any) => {
        toast.error(err?.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <SettingsLayout inlineWidth=''>
      <div className={classes.container}>
        <h4 style={{ margin: '0 0 10px', fontWeight: '600', fontSize: '14px' }}>
          Email Notifications
        </h4>
        <NotificationItem
          title='Daily Newsletter'
          caption='A small text of what the newsletter might contain'
          checked={newsCheck}
          onChange={() => setNewsCheck(!newsCheck)}
        />
        <NotificationItem
          title='Message'
          caption='Get notified when you receive a message '
          checked={messageCheck}
          onChange={() => setMessageCheck(!messageCheck)}
        />
        <NotificationItem
          title='Project Update'
          caption='Get informed whenever an update is made on the project you are working on'
          checked={updateCheck}
          onChange={() => setUpdateCheck(!updateCheck)}
        />
        <NotificationItem
          title='Project Deadline'
          caption='Know when a project is meeting is deadline'
          checked={deadlineCheck}
          onChange={() => setDeadlineCheck(!deadlineCheck)}
        />
        <div className={classes.actionButtons}>
          <div className={classes.leftButton}>
            <Button
              text='Save Changes'
              bgColor='#003B33'
              color='#fff'
              width='100%'
              onClick={handleNotificationUpdate}
              loading={loading}
              spinnerSize='13px'
            />
          </div>
          <div className={classes.rightButton}>
            <Button
              text='Cancel'
              border='1px solid #00262A'
              color='#00262A'
              width='100%'
              bgColor='#fff'
            />
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default Notifications;

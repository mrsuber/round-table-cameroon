import React, { useEffect, useState } from 'react';
import { languages } from '../../../assets/data/languages';
import { regions } from '../../../assets/data/regions';
import { timezones } from '../../../assets/data/timezones';
import Button from '../../../components/admin/button/Button.component';
import Dropdown from '../../../components/admin/dropdown/Dropdown.component';
import TimeZone from '../../../components/admin/timezone/TimeZone.component';
import SettingsLayout from '../../../layouts/Settings.layout';
import classes from './Settings.module.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  getProfileAction,
  updateGeneralSettingsAction,
} from '../../../store/features/slices/members/members.action';
import { getLocalRegion, setLocalRegion } from '../../../utils/localStorage';
import { formatEnum } from '../../../assets/data/timeFormat';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.members);
  const dispatch = useAppDispatch();

  const [region, setRegion] = useState<string>(
    profile?.generalSettings?.region ?? regions[0]?.region,
  );
  const [language, setLanguage] = useState<string>(
    profile?.generalSettings?.language ?? languages[0]?.lang,
  );
  const [timezone, setTimezone] = useState<string>(
    profile?.generalSettings?.timezone ?? timezones[0]?.timezone,
  );
  const [timeFormat, setTimeFormat] = useState<string>('' ?? formatEnum.TWELVE_HOURS);
  useEffect(() => {
    dispatch(getProfileAction(user?.accessToken));
  }, []);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGeneralSettingsUpdate = () => {
    setLoading(true);
    const data = {
      content: {
        language,
        timezone,
        twelveHourFormat: timeFormat === formatEnum.TWELVE_HOURS ? true : false,
        region,
      },
      token: user?.accessToken,
    };
    dispatch(updateGeneralSettingsAction(data))
      .then((res: any) => {
        const { payload } = res;
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
    <SettingsLayout inlineWidth='100%'>
      <Dropdown
        options={regions}
        id='region'
        label='Region'
        handleOption={(reg: string) => {
          setRegion(reg);
          setLocalRegion(reg);
        }}
        initialValue={region ?? profile?.generalSettings?.region ?? regions[0]?.region}
      />
      <Dropdown
        label='Languages'
        options={languages}
        id='lang'
        initialValue={language ?? profile?.generalSettings?.language ?? languages[0]?.lang}
        handleOption={(reg: string) => {
          setLanguage(reg);
        }}
      />
      <Dropdown
        label='Timezone'
        options={timezones}
        id='timezone'
        initialValue={timezone ?? profile?.generalSettings?.timezone ?? timezones[0]?.timezone}
        handleOption={(reg: string) => {
          setTimezone(reg);
        }}
      />
      <TimeZone
        handleOption={(reg: string) => {
          setTimeFormat(reg);
        }}
      />
      <div className={classes.actionButtons}>
        <div className={classes.leftButton}>
          <Button
            text='Save'
            bgColor='#003B33'
            color='#fff'
            width='100%'
            onClick={handleGeneralSettingsUpdate}
            loading={loading}
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
    </SettingsLayout>
  );
};

export default Settings;

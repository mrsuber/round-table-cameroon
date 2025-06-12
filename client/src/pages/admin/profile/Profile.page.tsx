import React, { useEffect, useState } from 'react';
import { regions } from '../../../assets/data/regions';
import { towns } from '../../../assets/data/towns';
import Avatar from '../../../components/admin/avatar/Avatar.component';
import Button from '../../../components/admin/button/Button.component';
import Dropdown from '../../../components/admin/dropdown/Dropdown.component';
import Gender from '../../../components/admin/gender/Gender.component';
import Input from '../../../components/admin/input/Input.component';
import SettingsLayout from '../../../layouts/Settings.layout';
import classes from './Profile.module.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateProfileAction,
  getProfileAction,
  uploadMemberProfileAction,
} from '../../../store/features/slices/members/members.action';
import TownsDropdown from '../../../components/admin/dropdown/TownsDropdown.component';
import {
  getLocalRegion,
  getLocalTown,
  setLocalRegion,
  setLocalTown,
} from '../../../utils/localStorage';
import { toast } from 'react-toastify';

const Profile = () => {
  const [image, setImage] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.members);
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoad, setSaveLoad] = useState<boolean>(false);
  const userTown = getLocalTown();
  const userRegion = getLocalRegion();

  const [firstName, setFirstName] = useState<string>(profile?.firstName ?? '');
  const [lastName, setLastName] = useState<string>(profile?.lastName ?? '');
  const [username, setUsername] = useState<string>(
    profile?.username ?? `${profile?.firstName} ${profile?.lastName}` ?? '',
  );
  const [profession, setProfession] = useState<string>(profile?.profession ?? '');
  const [linkedIn, setLinkedIn] = useState<string>(profile?.linkedIn ?? 'null');
  const [facebook, setFacebook] = useState<string>(profile?.facebook ?? 'null');
  const [twitter, setTwitter] = useState<string>(profile?.twitter ?? 'null');
  const [bio, setBio] = useState<string>(profile?.about ?? '');
  const [gender, setGender] = useState<string>(profile?.gender ?? 'Male');
  const [region, setRegion] = useState<any>(profile?.generalSettings?.region ?? 'South West');
  const [town, setTown] = useState<string>(userTown ? userTown : 'Buea');

  useEffect(() => {
    dispatch(getProfileAction(user?.accessToken));
  }, [profile]);

  const handleChange = (e: any) => {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const handleUpload = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    const data = {
      formData,
      token: user?.accessToken,
    };
    dispatch(uploadMemberProfileAction(data)).then((res: any) => {
      setLoading(false);
      toast.success('Profile image uploaded successfully');
    });
  };
  const handleEditProfile = () => {
    setSaveLoad(true)
    const data = {
      content: {
        firstName,
        lastName,
        about: bio,
        linkedIn,
        facebook,
        twitter,
        username,
        profession,
        town,
        gender,
        region,
      },
      token: user?.accessToken,
    };
    dispatch(updateProfileAction(data)).then((res: any) => {
      setSaveLoad(false)
      const { payload } = res;
      if (Array.isArray(payload?.errors)) {
        payload?.errors.forEach((err: any) => {
          toast.error(err);
        });
        return;
      }
      toast.success(payload?.message);
      dispatch(getProfileAction(user?.accessToken));
    });
  };
  return (
    <SettingsLayout inlineWidth='100%'>
      <div className={classes.container}>
        <div className={classes.left}>
          <label htmlFor='upload' className={classes.preview}>
            {profile.profileImage?.httpPath ? (
              <img src={profile.profileImage?.httpPath} alt='preview' crossOrigin='anonymous' />
            ) : (
              <Avatar
                size='100px'
                style={{
                  boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.06)',
                  border: '8px solid #E6F6F4',
                }}
                padding='6px'
                src={preview}
              />
            )}
            <input type='file' id='upload' style={{ display: 'none' }} onChange={handleChange} />
          </label>
          <div className={classes.actionButtons}>
            <Button
              text='Change Photo'
              bgColor='#003B33'
              color='#fff'
              margin='16px 0px'
              width='100%'
              onClick={handleUpload}
              loading={loading}
            />
            <Button
              text='Delete Photo'
              border='1px solid #00262A'
              color='#00262A'
              bgColor='#fff'
              width='100%'
              disabled
            />
          </div>
        </div>
        <div className={classes.right}>
          <div className={classes.inputRow}>
            <div className={classes.leftInput}>
              <Input
                label='First Name'
                placeholder='First Name'
                value={firstName}
                borderRadius='8px'
                labelStyle={{ textAlign: 'left', fontWeight: '600', fontSize: '14px' }}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className={classes.rightInput}>
              <Input
                label='Last Name'
                placeholder='Last Name'
                labelStyle={{ textAlign: 'left', fontWeight: '600', fontSize: '14px' }}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <Input
            label='Username'
            placeholder='Enter Username'
            margin='0 0 20px 0px'
            labelStyle={{ textAlign: 'left', fontWeight: '600', fontSize: '14px' }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label='Profession'
            placeholder='Enter Profession'
            margin='0 0 20px 0px'
            labelStyle={{ textAlign: 'left', fontWeight: '600', fontSize: '14px' }}
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          />
          <div className={classes.locations}>
            <div className={classes.leftDropdown}>
              <Dropdown
                options={regions}
                id='region'
                label='Region'
                handleOption={(reg: string) => {
                  setRegion(reg);
                  setLocalRegion(reg);
                }}
                initialValue={region ?? profile.generalSettings?.region}
              />
            </div>
            <div className={classes.rightDropdown}>
              <TownsDropdown
                options={towns}
                id={'towns'}
                label='Town'
                handleOption={(t: string) => {
                  setTown(t);
                  setLocalTown(t);
                }}
                region={region}
                initialValue={town}
              />
            </div>
          </div>
          <Gender handleOption={(g: string) => setGender(g)} />
          <Input
            label='Bio'
            style={{ height: '100px' }}
            labelStyle={{ textAlign: 'left', fontWeight: '600', fontSize: '14px' }}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Input
            label='Linkedin'
            placeholder='Enter Linkedin url'
            margin='0 0 20px 0px'
            labelStyle={{ textAlign: 'left', fontWeight: '600', fontSize: '14px' }}
            value={linkedIn}
            onChange={(e) => setLinkedIn(e.target.value)}
          />
          <Input
            label='Facebook'
            placeholder='Enter facebook url'
            margin='0 0 20px 0px'
            labelStyle={{ textAlign: 'left', fontWeight: '600', fontSize: '14px' }}
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
          <Input
            label='Twitter'
            placeholder='Enter twitter url'
            margin='0 0 20px 0px'
            labelStyle={{ textAlign: 'left', fontWeight: '600', fontSize: '14px' }}
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
          <div className={classes.actionButtonsBottom}>
            <div className={classes.leftInput}>
              <Button
                text='Save Changes'
                bgColor='#003B33'
                color='#fff'
                onClick={handleEditProfile}
                loading={saveLoad}
              />
            </div>
            <div className={classes.rightInput}>
              <Button text='Cancel' border='1px solid #00262A' color='#00262A' bgColor='#fff' />
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default Profile;

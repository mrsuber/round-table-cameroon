import React, { useEffect } from 'react';
import Avatar from '../avatar/Avatar.component';
import { MemberCardTypes } from './MemberCard.type';
import { NotesIcon, TickIcon } from '../../../assets/svg';
import pic from '../../../assets/images//placeholer.png';
import classes from './MemberCard.module.css';
import Button from '../button/Button.component';
import { useAppSelector } from '../../../store';

const MemberCard = ({
  name = '',
  description = 'A member',
  message,
  projectNo = '0',
  profile,
  width,
  height,
  loading,
  onApprove,
  isMember,
}: MemberCardTypes) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className={classes.container} style={{ width, height }}>
      <div className={classes.top}>
        <div className={classes.detail}>
          <Avatar src={profile ?? pic} size='33px' />
          <div className={classes.texts}>
            <h5 className={classes.name}>{name}</h5>
            <span className={classes.occupation}>{description}</span>
          </div>
        </div>
        <div className={classes.message}>Message</div>
      </div>
      {message && <p className={classes.messageText}>{message}</p>}
      <div className={classes.bottom} style={{ paddingTop: '10px' }}>
        <div style={{ display: 'flex' }}>
          <NotesIcon size='20' />
          <span className={classes.projectNum}>{projectNo} Projects</span>
        </div>
        {user?.user?.role === 'superAdmin' && (
          <Button
            text={isMember ? 'Approved' : 'Approve'}
            padding='0'
            bgColor=''
            color='#003B33'
            renderIcon={() => (
              <>
                {isMember ? (
                  <TickIcon
                    color='#003B33'
                    borderColor='#003B33'
                    style={{ position: 'relative', top: '8px' }}
                  />
                ) : (
                  <p>🚫</p>
                )}
              </>
            )}
            iconAfter
            onClick={!isMember ? onApprove : () => null}
            loading={loading}
            style={{ opacity: isMember ? 1 : 0.8 }}
          />
        )}
      </div>
    </div>
  );
};

export default MemberCard;

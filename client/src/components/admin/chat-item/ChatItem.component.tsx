import { ChatItemTypes } from './ChatItem.type';
import Avatar from '../avatar/Avatar.component';
import { ChatTickIcon } from '../../../assets/svg';
import classes from './ChatItem.module.css';

const ChatItem = ({
  profile,
  name = '👋',
  message = '',
  read,
  online,
  duration = '',
  onClick,
  active,
}: ChatItemTypes) => {
  const date = duration ? new Date(duration) : new Date();
  const hour = date?.getHours() < 10 ? `0${date?.getHours()}` : `${date?.getHours()}`;
  const mins = date?.getMinutes() < 10 ? `0${date?.getMinutes()}` : `${date?.getMinutes()}`;
  return (
    <div
      className={active ? `${classes.container} ${classes.activeContainer}` : classes.container}
      onClick={onClick}
    >
      <Avatar src={profile} size='26px' />
      <div className={classes.content}>
        <div className={`${classes.detail} ${classes.topDetail}`}>
          <span className={classes.name}>{name}</span>
          <span>
            {hour} : {mins} {new Date().getHours() < 10 ? 'AM' : 'PM'}
          </span>
        </div>
        <div className={classes.detail}>
          <span className={classes.messageText}>
            {message?.length < 28 ? message : `${message}...`}
          </span>
          {online && <div className={classes.online} />}
          {read && <ChatTickIcon size='12' />}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;

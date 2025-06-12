import Avatar from '../avatar/Avatar.component';
import { ChatProfileTypes } from './ChatProfile.type';
import classes from './ChatProfile.module.css';

const ChatProfile = ({ profile, name = 'Angelie Crison', online = true }: ChatProfileTypes) => {
  return (
    <div className={classes.container}>
      <Avatar src={profile} size='26px' />
      <div className={classes.content}>
        <span style={{ fontWeight: 'bold' }}>{name}</span>
        {online && (
          <div className={classes.status}>
            <div className={classes.online} />
            <span>Online</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatProfile;

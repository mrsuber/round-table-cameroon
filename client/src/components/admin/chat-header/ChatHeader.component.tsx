import { CallIcon, VideoIcon } from '../../../assets/svg';
import ChatProfile from '../chat-profile/ChatProfile.component';
import classes from './ChatHeader.module.css';

interface IProps {
  name?: string;
}

const ChatHeader = ({ name='' }: IProps) => {
  return (
    <div className={classes.container}>
      <ChatProfile name={name} />
      <div className={classes.interactions}>
        <VideoIcon size='18' className={classes.icons} />
        <CallIcon size='18' style={{ marginLeft: '30px' }} className={classes.icons} />
      </div>
    </div>
  );
};

export default ChatHeader;

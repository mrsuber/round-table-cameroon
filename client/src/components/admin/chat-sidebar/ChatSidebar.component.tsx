import { chatSidebarTypes } from './ChatSidebarType';
import ChatItem from '../chat-item/ChatItem.component';
import { getLocalReceiver, setLocalReceiver } from '../../../utils/localStorage';
import classes from './ChatSidebar.module.css';

const ChatSidebar = ({ onClick, users }: chatSidebarTypes) => {
  return (
    <div className={classes.chatsItems}>
      {users
        ?.filter((item: any) => item.self === false)
        .map((user: any, idx: any) => {
          return (
            <ChatItem
              key={`${user.username}` + `${idx}`}
              profile={user?.profile}
              name={user?.username}
              message={user?.messages[user?.messages?.length - 1]?.content.substring(0, 28)}
              read={!user.connected}
              online={user?.connected}
              duration={user?.date}
              onClick={() => {
                onClick?.(user);
                setLocalReceiver(user.userID);
              }}
              active={user.userID === getLocalReceiver()}
            />
          );
        })}
    </div>
  );
};

export default ChatSidebar;

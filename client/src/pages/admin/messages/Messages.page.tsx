import { useEffect, useRef, useState } from 'react';
import { SearchIcon } from '../../../assets/svg';
import Input from '../../../components/admin/input/Input.component';
import AdminLayout from '../../../layouts/Admin.layout';
import Chatting from '../../../components/admin/chatting/Chatting.component';
import ChatSidebar from '../../../components/admin/chat-sidebar/ChatSidebar.component';
import { io } from 'socket.io-client';
import {
  getJWT,
  getLocalUser,
  getLocalReceiver,
  setLocalSender,
  setLocalReceiver,
  getLocalSender,
} from '../../../utils/localStorage';
import { useAppDispatch, useAppSelector } from '../../../store';
import { baseUrl, endpoint } from '../../../api/config';
import classes from './Messages.module.css';
import { setChatUsers, setSender } from '../../../store/features/slices/chats/chats.slice';
// import KanbanLoading from '../../../components/admin/KandbanLoading/KanbanLoading.component';
// import AnimatedFlicker from '../../../components/admin/animated-flicker/AnimatedFlicker.component';
import test from '../../../assets/images/profile.jpg';
import { getUsersMessagesAction } from '../../../store/features/slices/chats/chats.action';

const Messages = () => {
  const { chatUsers, usersMessages } = useAppSelector((state) => state.chats);
  const [showChat, setShowChat] = useState(true);
  const [currentReceiver, setCurrentReceiver] = useState<any>({});
  const [receiverName, setReceiverName] = useState('');
  const [users, setUsers] = useState<any>([]);
  const [allUsers, setAllUsers] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const [message, setMessage] = useState<string>('');
  const [file, setFile] = useState<any>(null);
  const [fileList, setFileList] = useState<any>([]);
  const [previews, setPreviews] = useState<any>([]);
  const messagesEndRef = useRef<any>(null);
  const [value, setValue] = useState<string>('');

  const { user } = useAppSelector((state) => state.auth);
  const userToken = getLocalUser();
  const dispatch = useAppDispatch();
  const token = userToken?.token || user?.accessToken || getJWT();
  const effectRef = useRef<boolean>(true);

  const username = `${user?.user.firstName} ${user?.user.lastName}`;

  const socket = useRef(io(baseUrl, { autoConnect: false, query: { token } }));

  socket.current.on('session', ({ username, userID }: any) => {
    dispatch(setSender(userID));
    setLocalSender(userID);
  });
  socket.current.connect();
  // const sender = getLocalSender();
  // const receiver = getLocalReceiver();

  // socket.current.on('user connected', (user: any) => {
  //   console.log('connection user', user);
  // });
  // socket.current.on('connect_error', (err: any) => {
  //   console.log('connection error', err);
  // });
  useEffect(() => {
    if (effectRef) {
      effectRef.current = false;
      socket.current.on('private message', (message: any) => {
        if (message) {
          const { content, from, files } = message;
          setMessages((prev: any) => [
            ...prev,
            {
              content,
              from,
              files,
            },
          ]);
        }
      });
    }
    return () => {
      socket.current.off('private message');
    };
  }, [socket.current]);

  socket.current.on('users', (users: any) => {
    const allUsers = [...users];
    const addCurentDateUsers = allUsers?.map((user: any) => ({
      ...user,
      date: Date.now(),
    }));
    setAllUsers(addCurentDateUsers);
    setUsers(
      users.sort((a: any, b: any) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      }),
    );
    dispatch(
      setChatUsers(
        allUsers.sort((a: any, b: any) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        }),
      ),
    );
  });

  useEffect(() => {
    const receivingUser = chatUsers.find((user: any) => getLocalReceiver() === user.userID);
    const mainUser = chatUsers?.find((user: any) => user.self === true);
    setLocalSender(mainUser?.userID);
    setReceiverName(receivingUser?.username);
    setLocalReceiver(receivingUser?.userID);
  }, [socket.current, currentReceiver]);

  useEffect(() => {
    const filtered =
      chatUsers?.filter((user: any) =>
        user?.username?.toLowerCase().includes(value.toLowerCase()),
      ) ||
      users?.filter((user: any) => user?.username?.toLowerCase().includes(value.toLowerCase()));
    setAllUsers(filtered);
  }, [value]);

  const handleSend = () => {
    if (message) {
      const messageContent = {
        content: {
          text: message,
          files: fileList ?? null,
        },
        to: getLocalReceiver(),
      };
      setMessages((prev: any) => [
        ...prev,
        {
          content: {
            text: message,
            files: previews ?? null,
          },
          from: getLocalSender(),
        },
      ]);
      socket.current.emit('private message', messageContent);
    }
    clearData();
  };

  const handleChange = (e: any) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
    setFileList([
      ...fileList,
      {
        name: e.target.files[0].name,
        mimetype: e.target.files[0].type,
        size: e.target.files[0].size,
        file: e.target.files[0],
      },
    ]);
    const preview = URL.createObjectURL(e.target.files[0]);
    setPreviews((prev: any) => [...prev, preview]);
  };

  const handleAttachmentDelete = (pre: any) => {
    const previewCopy = [...previews];
    const itemToRemove = previewCopy.filter((item: any) => item === pre);
    previewCopy.splice(previews.indexOf(itemToRemove), 1);
    setPreviews(previewCopy);
  };

  const clearData = () => {
    setPreviews([]);
    setFileList([]);
    setMessage('');
  };

  const handleEmojiSelect = (emj: any) => {
    setMessage(message + emj);
  };

  return (
    <AdminLayout bgColor='#fff' padding='4vh 12px 10px 4px'>
      <div className={classes.container}>
        <div className={classes.chats}>
          <div className={classes.usersHeader}>
            <h4>{username}</h4>
            <Input
              placeholder='search member'
              renderIcon={() => <SearchIcon size='13' color='grey' />}
              padding='5px'
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className={classes.mainSidebar}>
            <ChatSidebar
              socket={socket}
              onClick={(user) => {
                setCurrentReceiver(user);
                setShowChat(true);
                setMessages([]);
              }}
              username={username}
              users={allUsers ?? users}
              chatUsers={allUsers ?? chatUsers}
            />
          </div>
        </div>
        <div className={classes.chatting}>
          <Chatting
            showChat={showChat}
            onClickBack={() => setShowChat(false)}
            socket={socket}
            name={currentReceiver.username ?? receiverName}
            onSend={handleSend}
            users={users}
            chatUsers={chatUsers}
            onKeyDown={handleSend}
            onFileChange={handleChange}
            onChange={(e: any) => setMessage(e.target.value)}
            value={message}
            messages={messages}
            previews={previews}
            messageRef={messagesEndRef}
            handleAttachmentDelete={handleAttachmentDelete}
            onEmojiSelect={(emj: any) => handleEmojiSelect(emj)}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Messages;

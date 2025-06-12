import { useEffect, useState } from 'react';
import ChatHeader from '../chat-header/ChatHeader.component';
import ChatDay from '../chat-day/ChatDay.component';
import ChatBlock from '../chat-block/ChatBlock.component';
import { ChattingTypes } from './Chatting.type';
import BackwardArrow from '../../../icons/BackwardArrow';
import Input from '../input/Input.component';
import { AttachmentIcon, CloseIcon, SendIcon } from '../../../assets/svg';
import footerClasses from '../chat-footer/ChatFooter.module.css';
import { getLocalReceiver, getLocalSender } from '../../../utils/localStorage';
import classes from './Chatting.module.css';
import KanbanLoading from '../KandbanLoading/KanbanLoading.component';
import AnimatedFlicker from '../animated-flicker/AnimatedFlicker.component';
import chat from '../../../assets/images/chat.jpg';
import ChatFooter from '../chat-footer/ChatFooter.component';
import DeleteModal from '../delete-modal/DeleteModal.component';
import { useAppDispatch, useAppSelector } from '../../../store';
import { deleteMessageAction } from '../../../store/features/slices/chats/chats.action';
import { chatActionsEnumn } from '../../../assets/data/chatActions';
import { toast } from 'react-toastify';

const Chatting = ({
  showChat = true,
  onClickBack,
  socket,
  name,
  users,
  chatUsers,
  onFileChange,
  onSend,
  onKeyDown,
  onChange,
  value,
  messages,
  previews,
  messageRef,
  handleAttachmentDelete,
  onEmojiSelect,
  sent,
}: ChattingTypes) => {
  
  const [activeMessageID, setActiveMessageID] = useState<string>('');
  const [activeMessageState, setActiveMessageState] = useState<boolean>(false);
  const [messageIds, setMessageIds] = useState<any[]>([]);
  const [messageContent, setMessageContent] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isForwarding, setIsForwarding] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleActionClick = (msgId: string, actionId: string) => {
    if (actionId === chatActionsEnumn.DELETE) {
      setIsDeleting(true);
      setMessageIds((prev: any) => [...prev, msgId]);
      setActiveMessageID('');
      return;
    } else if (actionId === chatActionsEnumn.FORWARD) {
      setIsForwarding(true);
      setMessageIds((prev: any) => [...prev, msgId]);
      return;
    }
  };

  const handleCheckForward = (msgId: string, message: any) => {
    if (messageIds.includes(msgId)) {
      const messageIdsCopy = [...messageIds];
      const index = messageIds.indexOf(msgId);
      messageIdsCopy.splice(index, 1);
      setMessageIds(messageIdsCopy);
      return;
    } else {
      setMessageIds((prev: any) => [...prev, msgId]);
      setMessageContent((prev: any) => [...prev, message]);
    }
  };

  const handleDeleteMessage = () => {
    const data = {
      messageIds,
      token: user?.accessToken,
    };
    dispatch(deleteMessageAction(data)).then((res: any) => {
      const { payload } = res;
      if (payload?.success) {
        setIsDeleting(false);
        return toast.success('Message Successfully Deleted');
      }
      return toast.error('Error Deleting Message');
    });
  };
  const mouseE = () => {
    if (activeMessageState) {
      setActiveMessageState(false);
    } else if (!activeMessageState) {
      setActiveMessageState(true);
    } else return
  };
  useEffect(() => {
    document.addEventListener('mousedown', mouseE);
    return () => document.removeEventListener('mousedown', mouseE);
  });

  return (
    <>
      <div className={classes.chatting}>
        {showChat ? (
          <>
            <div className={classes.heading}>
              <div className={classes.backArrow} onClick={onClickBack}>
                <BackwardArrow />
              </div>
              <ChatHeader name={name} />
            </div>
            <div className={classes.conversing}>
              <div className={classes.scrollView} ref={messageRef}>
                <div className={classes.chatDay}>
                  <ChatDay day='Today' />
                </div>
                <div className={classes.conversation}>
                  {chatUsers
                    .filter(
                      (user: any) =>
                        user.userID === getLocalReceiver() ||
                        user.userID === getLocalSender() ||
                        user.self === getLocalSender(),
                    )
                    .map((chatUser: any) =>
                      chatUser?.messages?.map((msg: any, idx: any) => {
                        return (
                          <div
                            className={
                              msg.from === getLocalSender()
                                ? `${classes.column} ${classes.columnRight}`
                                : classes.column
                            }
                            key={msg._id}
                          >
                            <ChatBlock
                              // image={msg?.files?.httpPath ?? null}
                              serverImages={msg?.files}
                              sending={msg?.from === getLocalSender()}
                              date={msg?.createdAt}
                              images={[]}
                              isDrop={msg?._id === activeMessageID && activeMessageState}
                              onDropClick={() => {
                                setActiveMessageID(msg?._id);
                                // setActiveMessageState(!activeMessageState);
                              }}
                              onActionClick={(actionId: string) =>
                                handleActionClick(msg?._id, actionId)
                              }
                              dropStyle={
                                idx === chatUser?.messages?.length - 1 ? { top: '-14rem' } : {}
                              }
                              isForwarding={isForwarding}
                              toForward={messageIds.includes(msg?._id)}
                              onCheckForward={() => handleCheckForward(msg?._id, msg)}
                            >
                              <p style={{ margin: '0' }}>{msg?.content ?? ''}</p>
                            </ChatBlock>
                          </div>
                        );
                      }),
                    )}
                  {messages.map((msg: any, idx: any) => {
                    return (
                      <div
                        className={
                          msg.from === getLocalSender()
                            ? `${classes.column} ${classes.columnRight}`
                            : classes.column
                        }
                        key={idx}
                      >
                        <ChatBlock
                          images={msg?.content?.files ?? null}
                          sending={msg.from === getLocalSender()}
                          isNowDate
                          serverImages={[]}
                        >
                          <p style={{ margin: '0' }}>{msg?.content.text ?? msg?.content ?? ''}</p>
                        </ChatBlock>
                      </div>
                    );
                  })}
                </div>
                {/* <div ref={messageRef} /> */}
              </div>
              <div>
                <ChatFooter
                  onSend={onSend}
                  onFileSelect={onFileChange}
                  onTextChange={onChange}
                  onEmojiSelect={onEmojiSelect}
                  value={value}
                  placeholder='Message'
                  onKeyDown={onKeyDown}
                />
                <div className={classes.coverPreviews}>
                  {previews?.map((pre: any, idx: number) => {
                    return (
                      <div
                        key={`${pre} ${idx}`}
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '80%' }}>
                          <CloseIcon size='6' onClick={() => handleAttachmentDelete(pre)} />
                        </div>
                        <label htmlFor='upload'>
                          <div className={classes.uploadBtn}>
                            <img
                              src={pre}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                objectPosition: 'center',
                              }}
                              alt='Pdf File'
                              crossOrigin='anonymous'
                            />
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <KanbanLoading
            containerStyle={{
              backgroundColor: 'rgba(255,255,255, 0.9)',
              position: 'relative',
              width: '63vw',
            }}
          >
            <AnimatedFlicker>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                Connect with All...😃🙌🙌🙌
              </div>
              <img src={chat} alt='chatting' style={{ width: '25vw' }} />
            </AnimatedFlicker>
          </KanbanLoading>
        )}
        <KanbanLoading
          kanbanLoading={isDeleting}
          containerStyle={{
            backgroundColor: 'rgba(255,255,255, 0.3)',
          }}
        >
          <DeleteModal onDelete={handleDeleteMessage} onCancel={() => setIsDeleting(false)} />
        </KanbanLoading>
      </div>
    </>
  );
};

export default Chatting;

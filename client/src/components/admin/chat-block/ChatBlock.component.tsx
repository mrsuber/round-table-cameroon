import { useEffect, useState } from 'react';
import { ChatBlockTypes } from './ChatBlock.type';
import classes from './ChatBlock.module.css';
import KanbanLoading from '../KandbanLoading/KanbanLoading.component';
import { ClockIcon, CloseIconOutlined } from '../../../assets/svg';
import seen from '../../../assets/images/seen.png';
import download from '../../../assets/images/download.png';
import { ChevronIcon } from '../../../icons';
import { chatActions, chatActionsProps } from '../../../assets/data/chatActions';

const ChatBlock = ({
  sending = true,
  children,
  images,
  style,
  date,
  isNowDate,
  sent = true,
  serverImages,
  isDrop,
  onActionClick,
  onDropClick,
  onCheckForward,
  isForwarding,
  toForward,
  dropStyle,
}: ChatBlockTypes) => {
  const mainDate = isNowDate ? new Date() : new Date(date);
  const hour = mainDate?.getHours() < 10 ? `0${mainDate?.getHours()}` : `${mainDate?.getHours()}`;
  const mins =
    mainDate?.getMinutes() < 10 ? `0${mainDate?.getMinutes()}` : `${mainDate?.getMinutes()}`;
  const [file, setFile] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleImageSelect = (file: any) => {
    setShowModal(true);
    setFile(file);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = file;
    link.href = file;
    link.target = '_blank';
    link.click();
  };
  return (
    <div className={classes.main}>
      {isForwarding &&
        (toForward ? (
          <div className={classes.checked} style={{ backgroundColor: toForward ? '#003B33' : '' }} />
        ) : (
          <div className={classes.checked} onClick={onCheckForward} />
        ))}
      <div
        style={{
          ...style,
        }}
        className={classes.container}
      >
        <div
          style={{
            borderTopRightRadius: sending ? '0' : '8px',
            borderTopLeftRadius: sending ? '8px' : '0px',
            backgroundColor: sending ? '#003B33' : '#fff',
            color: sending ? '#fff' : '#00262a',
          }}
          className={classes.content}
        >
          <div className={classes.dropdownIcon}>
            <ChevronIcon
              size='20'
              color='#fff'
              className={classes.downIcon}
              onClick={onDropClick}
            />
            {isDrop && (
              <div className={classes.actionsDropdown} style={dropStyle}>
                {chatActions.map((item: chatActionsProps) => (
                  <p
                    key={item.id}
                    className={classes.actionItem}
                    onClick={() => onActionClick?.(item.label)}
                  >
                    {item.label}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div
            className={classes.images}
            style={{ marginBottom: images?.length > 0 || serverImages?.length > 0 ? '10px' : '' }}
          >
            {images?.length > 0 &&
              (images && images?.length > 1 ? (
                images?.map((file: any, index: number) => (
                  <img
                    key={`${file}`}
                    src={file}
                    alt='a pic'
                    className={classes.image}
                    crossOrigin='anonymous'
                    onClick={() => handleImageSelect(file?.httpPath)}
                  />
                ))
              ) : (
                <div key={`${images?.[0]}`}>
                  <img
                    src={images?.[0]}
                    alt='a pic'
                    className={classes.image}
                    crossOrigin='anonymous'
                    onClick={() => handleImageSelect(images?.[0])}
                  />
                </div>
              ))}
            {serverImages?.length > 0 &&
              serverImages?.map((file: any, index: number) => (
                <div key={`${file?.httpPath} ${index}`}>
                  <img
                    src={file?.httpPath}
                    alt='a pic'
                    className={classes.image}
                    crossOrigin='anonymous'
                    onClick={() => handleImageSelect(file?.httpPath)}
                  />
                </div>
              ))}
          </div>
          {children}
        </div>
        <span style={{ padding: '8px 0', fontWeight: '400', fontSize: '10px' }}>
          {hour} : {mins} {new Date().getHours() < 10 ? 'AM' : 'PM'}
          <span className={classes.seen}>
            {sent ? <img src={seen} alt='seen' /> : <ClockIcon size='8' />}
          </span>
        </span>
        <KanbanLoading
          kanbanLoading={showModal}
          containerStyle={{
            backgroundColor: '#fff',
            position: 'fixed',
          }}
        >
          <div className={classes.previewContainer}>
            <div className={classes.closeHead}>
              <img
                src={download}
                alt='download'
                className={classes.topIcon}
                onClick={handleDownload}
              />
              <CloseIconOutlined
                color='#383838'
                size='13'
                onClick={() => setShowModal(false)}
                className={classes.topIcon}
                style={{ width: '17px', height: '17px', marginRight: '0' }}
              />
            </div>
            <div className={classes.magnified}>
              <img src={file} alt='a pic' crossOrigin='anonymous' />
            </div>
            <div className={classes.miniPreviewImages}>
              {images?.length > 0 &&
                images?.map((pre: any, idx: number) => (
                  <div key={`${pre} ${idx}`}>
                    <img
                      src={pre}
                      alt='a pic'
                      crossOrigin='anonymous'
                      className={classes.previewMiniImage}
                      onClick={() => handleImageSelect(pre)}
                    />
                  </div>
                ))}
              {serverImages?.length > 0 &&
                serverImages?.map((pre: any, idx: number) => (
                  <div key={`${pre} ${idx}`}>
                    <img
                      src={pre?.httpPath}
                      alt='a pic'
                      crossOrigin='anonymous'
                      className={classes.previewMiniImage}
                      onClick={() => handleImageSelect(pre?.httpPath)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </KanbanLoading>
      </div>
    </div>
  );
};

export default ChatBlock;

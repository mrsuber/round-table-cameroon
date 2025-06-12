export interface ChattingTypes {
  showChat?: boolean;
  onClickBack?: () => void;
  onSend?: () => void;
  socket?: any;
  username?: string;
  name?: string;
  currentReceiver?: any;
  onChange?: any;
  userID?: string;
  users?: any;
  chatUsers?: any;
  onFileChange?: any;
  onKeyDown?: any;
  value?: string;
  messages?: any;
  previews?: any;
  messageRef?: any;
  handleAttachmentDelete?: any;
  onEmojiSelect?: (emohi: any) => void;
  sent?: boolean
}

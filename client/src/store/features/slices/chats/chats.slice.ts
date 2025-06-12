import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { BaseResponseType, ChatType } from '../../../store.types';
import { getUsersMessagesAction } from './chats.action';

const initialState: ChatType = {
  chats: [],
  receiver: '',
  sender: '',
  chatUsers: [],
  usersMessages: []
};

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setSender(state, { payload }: PayloadAction<any>) {
      state.sender = payload;
    },
    setReceiver(state, { payload }: PayloadAction<any>) {
      state.receiver = payload;
    },
    setChatUsers(state, { payload }: PayloadAction<any>) {
      state.chatUsers = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        isAnyOf(getUsersMessagesAction.fulfilled),
        (state, { payload }: PayloadAction<BaseResponseType>) => {
          state.loading = false;
          state.usersMessages = payload;
          state.error = null;
        },
      )
      .addMatcher(isAnyOf(getUsersMessagesAction.rejected), (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setSender, setReceiver, setChatUsers } = chatSlice.actions;
export default chatSlice.reducer;

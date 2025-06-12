import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { loginUserAction, registerUserAction } from './auth.action';
import { clearLocalUser } from '../../../../utils/localStorage';
import { AuthType } from '../../../store.types';

const initialState: AuthType = {
  loading: false,
  user: {},
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    logoutUser(state) {
      state.user = null;
      state.error = null;
      clearLocalUser();
    },
  },
  extraReducers: {
    [registerUserAction.fulfilled.toString()]: (state) => {
      state.loading = false;
      state.error = null;
    },
    [loginUserAction.fulfilled.toString()]: (state, { payload }: PayloadAction<AuthType | any>) => {
      state.loading = false;
      state.user = payload?.data?.tokens;
      state.error = null;
    },
    [registerUserAction.rejected.toString()]: (state, { payload }: PayloadAction<any>) => {
      state.loading = false;
      state.error = payload;
    },
    [loginUserAction.rejected.toString()]: (state, { payload }: PayloadAction<any>) => {
      state.error = payload;
      state.loading = false;
    },
  },
});
export const { logoutUser, setUserInfo } = authSlice.actions;
export default authSlice.reducer;

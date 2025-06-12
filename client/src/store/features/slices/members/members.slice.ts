import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { BaseResponseType } from '../../../store.types';
import { getMembersAction, getProfileAction, updateProfileAction } from './members.action';

interface MembersType extends BaseResponseType {
  members: any;
  profile: any;
  successMessage: string;
}

const initialState: MembersType = {
  loading: false,
  error: null,
  members: null,
  profile: null,
  successMessage: '',
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {},
  extraReducers: {
    [getMembersAction.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.loading = false;
      state.members = payload;
      state.error = null;
    },
    [getMembersAction.rejected.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.error = payload;
      state.loading = false;
    },
    [getProfileAction.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.loading = false;
      state.profile = payload;
    },
    [getProfileAction.rejected.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.error = payload;
      state.loading = false;
    },
    [updateProfileAction.fulfilled.toString()]: (state, { payload }: any) => {
      state.loading = false;
      state.successMessage = payload;
      state.error = null;
    },
    [updateProfileAction.rejected.toString()]: (
      state,
      { payload }: any,
    ) => {
      state.error = payload;
      state.loading = false;
    },
  },
});
export default membersSlice.reducer;

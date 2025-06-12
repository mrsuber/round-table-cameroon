import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { BaseResponseType } from '../../../store.types';
import { getDonationsAction, getTransfersAction } from './donations.action';

interface DonationsType extends BaseResponseType {
  transfers: any;
  donations: any;
}

const initialState: DonationsType = {
  loading: false,
  error: null,
  transfers: null,
  donations: null,
};

const donationsSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {},
  extraReducers: {
    [getDonationsAction.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.loading = false;
      state.donations = payload;
      state.error = null;
    },
    [getDonationsAction.rejected.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.error = payload;
      state.loading = false;
    },
    [getTransfersAction.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.loading = false;
      state.transfers = payload;
      state.error = null;
    },
    [getTransfersAction.rejected.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.error = payload;
      state.loading = false;
    },
  },
});
export default donationsSlice.reducer;

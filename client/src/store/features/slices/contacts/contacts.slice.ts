import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { BaseResponseType } from '../../../store.types';
import { getPartnersAction } from './contacts.action';

interface ContactsType extends BaseResponseType {
  partners: any;
}

const initialState: ContactsType = {
  loading: false,
  error: null,
  partners: null,
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        isAnyOf(getPartnersAction.fulfilled),
        (state, { payload }: PayloadAction<BaseResponseType>) => {
          state.loading = false;
          state.partners = payload;
          state.error = null;
        },
      )
      .addMatcher(isAnyOf(getPartnersAction.rejected), (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});
export default contactsSlice.reducer;

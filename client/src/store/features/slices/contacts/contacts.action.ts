import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendUrls } from '../../../../api/urls';
import { ContactFormType } from '../../../store.types';
import { startLoading, stopLoading } from '../loader/loader.slice';
import axiosInstance from '../../../../api/axiosConfig';

export const createContactFormAction = createAsyncThunk(
  'contacts/create-form',
  async (data: ContactFormType, { rejectWithValue, dispatch }) => {
    try {
      dispatch(startLoading());
      const res = await axiosInstance.post(backendUrls.contact.CREATEFORM, data);
      dispatch(stopLoading());
      return res?.data;
    } catch (error: any) {
      dispatch(stopLoading());
      if (error?.response && error?.response.data) {
        return rejectWithValue(error?.response.data);
      } else {
        return rejectWithValue(error);
      }
    }
  },
);
export const subscribeToNewsletterAction = createAsyncThunk(
  'contacts/subscribe',
  async (email: string, { rejectWithValue, dispatch }) => {
    try {
      dispatch(startLoading());
      const res = await axiosInstance.post(backendUrls.contact.SUBSCRIBE, { email });
      dispatch(stopLoading());
      return res?.data;
    } catch (error: any) {
      dispatch(stopLoading());
      if (error?.response && error?.response.data) {
        return rejectWithValue(error?.response.data);
      } else {
        return rejectWithValue(error);
      }
    }
  },
);
export const getPartnersAction = createAsyncThunk('auth/contacts/partners', async (args, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const res = await axiosInstance.get(backendUrls.contact.GETPARTNERS);
    return res?.data?.result;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue(error);
    }
  }
});

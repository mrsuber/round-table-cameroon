import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendUrls } from '../../../../api/urls';
import { ContactFormType } from '../../../store.types';
import { startLoading, stopLoading } from '../loader/loader.slice';
import axiosInstance from '../../../../api/axiosConfig';

export const getUsersMessagesAction = createAsyncThunk(
  'contacts/get-users-messages',
  async (_, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
      dispatch(startLoading());
      const res = await axiosInstance.get(backendUrls.chats.GETUSERSMESSAGES);
      return res?.data?.messages;
    } catch (error: any) {
      if (error?.response && error?.response.data) {
        return rejectWithValue(error?.response.data);
      } else {
        return rejectWithValue(error);
      }
    } finally {
      dispatch(stopLoading());
    }
  },
);
export const deleteMessageAction = createAsyncThunk(
  'projects/delete-message',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.post(
        backendUrls.chats.DELETEMESSAGE,
        { messageIds: data?.messageIds },
        {
          headers: {
            Authorization: `Bearer ${data?.token}`,
          },
        },
      );
      return res?.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error);
      }
    } finally {
      dispatch(stopLoading());
    }
  },
);

import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendUrls } from '../../../../api/urls';
import { startLoading, stopLoading } from '../loader/loader.slice';
import axiosInstance from '../../../../api/axiosConfig';

export const getMembersAction = createAsyncThunk(
  'user/members',
  async (
    { pageNumber, limit = 1000 }: { pageNumber?: number | any; limit?: number | any },
    thunkAPI,
  ) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.get(
        `${backendUrls.members.GETMEMBERS}?pageNumber=${pageNumber}&limit=${limit}`,
      );
      return res?.data?.result;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error);
      }
    }
  },
);
export const getUsersAction = createAsyncThunk(
  'user/members',
  async ({ limit = 1000 }: { limit?: number | any }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.get(`${backendUrls.members.GETUSERS}?limit=${limit}`);
      return res?.data?.result;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error);
      }
    }
  },
);
export const approveMemberAction = createAsyncThunk(
  'user/approve-member',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(
        backendUrls.members.APPROVEMEMBER,
        { email: data.email },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
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
export const uploadMemberProfileAction = createAsyncThunk(
  'user/upload-profile',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(backendUrls.members.ADDPROFILE, data?.formData, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
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
export const updateProfileAction = createAsyncThunk(
  'user/edit-profile',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(backendUrls.members.UPDATEPROFILE, data.content, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
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
export const getProfileAction = createAsyncThunk(
  'user/get-profile',
  async (token: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.get(backendUrls.members.GETPROFILE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res?.data?.user;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error);
      }
    }
  },
);
export const updateGeneralSettingsAction = createAsyncThunk(
  'user/edit-general-settings',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(backendUrls.members.UPDATEGENERALSETTINGS, data.content, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
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
export const updateNotificationSettingsAction = createAsyncThunk(
  'user/edit-general-settings',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(backendUrls.members.UPDATENOTIFICATIONSETTINGS, data.content, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
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

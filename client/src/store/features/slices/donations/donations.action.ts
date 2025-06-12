import { createAsyncThunk } from '@reduxjs/toolkit';
import { startLoading, stopLoading } from '../loader/loader.slice';
import axiosInstance from '../../../../api/axiosConfig';
import { backendUrls } from '../../../../api/urls';

export const createDonation = createAsyncThunk(
  'donations/create-donation',
  async (data: any, { rejectWithValue, dispatch }) => {
    dispatch(startLoading());
    try {
      const res = await axiosInstance.post(backendUrls.donations.CREATEDONATION, data);
      // toast.success(res?.data.message);
      return res?.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error);
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const getDonationsAction = createAsyncThunk(
  'donations/get-donations',
  async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.get(`${backendUrls.donations.GETDONATIONS}?limit=1000&state=SUCCESSFUL`);
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

export const getTransfersAction = createAsyncThunk(
  'donations/get-transfers',
  async ({ state, limit = 1000 }: { state?: string | any; limit?: number | any }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.get(
        `${backendUrls.donations.GETTRANSFERS}?limit=${limit}&state=${state}`,
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

import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendUrls } from '../../../../api/urls';
import { LoginDataType, RegisterDataType } from '../../../../types';
import { startLoading, stopLoading } from '../loader/loader.slice';
import {
  setLocalPass,
  setLocalEmail,
  setLocalUser,
  setRefreshToken,
  getRefreshToken,
  setJWT,
  setLocalRole,
} from '../../../../utils/localStorage';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../api/axiosConfig';
import { logoutUser } from './auth.slice';

export const registerUserAction = createAsyncThunk(
  'auth/register',
  async (data: RegisterDataType, { rejectWithValue, dispatch }) => {
    try {
      dispatch(startLoading());
      const res = await axios.post(backendUrls.users.REGISTER, data);
      setLocalEmail(data?.email);
      setLocalPass(data?.password);
      dispatch(stopLoading());
      return res?.data?.user;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response);
      } else {
        return rejectWithValue(error);
      }
    } finally {
      dispatch(stopLoading());
    }
  },
);
export const loginUserAction = createAsyncThunk(
  'auth/login',
  async (data: LoginDataType, { rejectWithValue, dispatch }) => {
    try {
      dispatch(startLoading());
      const res = await axiosInstance.post(backendUrls.users.LOGIN, data);
      setLocalUser({
        token: res?.data?.tokens?.accessToken,
        role: res?.data?.tokens?.user.role,
        isMember: res?.data?.tokens?.user.isMember,
      });
      setJWT(res?.data?.tokens?.accessToken);
      setRefreshToken(res?.data?.tokens?.refreshToken);
      setLocalEmail(res?.data?.tokens?.user.email);
      setLocalRole(res?.data?.tokens?.user?.role);
      dispatch(stopLoading());
      return res;
    } catch (error: any) {
      dispatch(stopLoading());
      if (error.response && error.response.data) {
        return rejectWithValue(error.response);
      } else {
        return rejectWithValue(error);
      }
    }
  },
);
export const verifyAccountAction = createAsyncThunk(
  'auth/verify-account',
  async (data: any, { rejectWithValue, dispatch }) => {
    try {
      dispatch(startLoading());
      const res = await axiosInstance.patch(backendUrls.users.VERIFY, data);
      dispatch(stopLoading());
      return res?.data?.message;
    } catch (error: any) {
      dispatch(stopLoading());
      if (error.response && error.response.data.message) {
        if (error.response.data.message === 400) {
          toast.success(error.response.data.message);
        }
        return rejectWithValue(error.response.data.message);
      } else {
        toast.error(error.message);
        return rejectWithValue(error.message);
      }
    }
  },
);
export const resendVerificationCodeAction = createAsyncThunk(
  'auth/resend-verification-code',
  async (email: string | any, { rejectWithValue, dispatch }) => {
    try {
      dispatch(startLoading());
      const res = await axiosInstance.post(backendUrls.users.RESENDVERIFICATIONCODE, { email });
      dispatch(stopLoading());
      return res?.data?.message;
    } catch (error: any) {
      dispatch(stopLoading());
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const forgotPasswordAction = createAsyncThunk(
  'auth/forgot-password',
  async (email: string, { rejectWithValue, dispatch }) => {
    try {
      dispatch(startLoading());
      const res = await axiosInstance.post(backendUrls.users.FORGOTPASSWORD, { email });
      setLocalEmail(email);
      dispatch(stopLoading());
      return res?.data;
    } catch (error: any) {
      dispatch(stopLoading());
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error);
      }
    }
  },
);
export const resetPasswordAction = createAsyncThunk(
  'auth/reset-password',
  async (data: any, { rejectWithValue, dispatch }) => {
    try {
      dispatch(startLoading());
      const res = await axiosInstance.patch(backendUrls.users.RESETPASSWORD, data);
      dispatch(stopLoading());
      return res?.data;
    } catch (error: any) {
      dispatch(stopLoading());
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error);
      }
    }
  },
);

export const refreshTokenAction = createAsyncThunk(
  'auth/refresh-token',
  async (refreshToken: any, { rejectWithValue, dispatch }) => {
    if (refreshToken && typeof refreshToken === 'string') {
      await axiosInstance
        .post(backendUrls.users.REFRESHTOKEN, { refreshToken })
        .then((res: any) => {
          console.log('ashas', res)
          setJWT(res?.data?.tokens?.accessToken);
          setRefreshToken(res?.data?.tokens?.refreshToken);
          return res?.data;
        })
        .catch((err: any) => {
          console.log('any err', err);
          if (err?.status === 500) {
            dispatch(logoutUser());
            window.location.href = '/';
            return;
          }
          return err;
        });
    }
  },
);

export const changePasswordAction = createAsyncThunk(
  'auth/change-password',
  async (data: any, { rejectWithValue, dispatch }) => {
    try {
      dispatch(startLoading());
      const res = await axiosInstance.post(backendUrls.users.CHANGEPASSWORD, data.userData, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      dispatch(stopLoading());
      return res?.data;
    } catch (error: any) {
      dispatch(stopLoading());
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error);
      }
    }
  },
);

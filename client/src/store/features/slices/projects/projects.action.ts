import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendUrls } from '../../../../api/urls';
import { startLoading, stopLoading } from '../loader/loader.slice';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../api/axiosConfig';

export const getProjectsAction = createAsyncThunk(
  'projects/projects',
  async ({ role, token }: { role: string; token?: string }, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      if (role === '' || token === '') {
        const res = await axiosInstance.get(`${backendUrls.projects.GETPROJECTS}?limit=1000`);
        return res?.data?.result;
      }
      const res = await axiosInstance.get(`${backendUrls.projects.GETALLPROJECTS}?limit=1000`);
      return res?.data?.result;
    } catch (error: any) {
      if (error?.message) {
        return rejectWithValue(error?.message);
      } else {
        return rejectWithValue(error);
      }
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const getProjectDetailsAction = createAsyncThunk(
  'projects/project-details',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.get(`${backendUrls.projects.GETPROJECTDETAILS(data?.id)}`, {
        headers: {
          Authorization: `Bearer ${data?.token}`,
        },
      });
      return res?.data;
    } catch (error: any) {
      return rejectWithValue(error);
    } finally {
      dispatch(stopLoading());
    }
  },
);
export const addProjectAction = createAsyncThunk(
  'projects/add-project',
  async (data: any, { rejectWithValue, dispatch }) => {
    dispatch(startLoading());
    try {
      const res = await axiosInstance.post(backendUrls.projects.ADDPROJECT, data.formData, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      // toast.success(res?.data.message);
      return res?.data?.message;
    } catch (error: any) {
      return rejectWithValue(error);
    } finally {
      dispatch(stopLoading());
    }
  },
);
export const deleteProjectAction = createAsyncThunk(
  'projects/delete-project',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.delete(`${backendUrls.projects.DELETEPROJECT}/${data.id}`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      toast.success('Project Deleted!');
      return res?.data?.result;
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
export const toggleProjectVisibilityAction = createAsyncThunk(
  'projects/toggle-project-visibility',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(
        `${backendUrls.projects.TOGGLEVISIBILITY}`,
        { projectId: data.id },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );
      return res?.data?.result;
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
export const editProjectAction = createAsyncThunk(
  'projects/edit-project',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(backendUrls.projects.EDITPROJECT, data.content, {
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

export const addProjectAttachment = createAsyncThunk(
  'tasks/add-project-attchment',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(
        backendUrls.projects.ADDATTACHMENT(data.id),
        data.content,
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

export const deleteProjectAttachmentAction = createAsyncThunk(
  'tasks/delete-attachment',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(
        backendUrls.projects.DELETEPROJECTATTACHMENT,
        data.content,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );
      return res?.data?.result;
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

export const updateProjectImageAction = createAsyncThunk(
  'user/update-project-image',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(
        backendUrls.projects.UPDATEPROJECTIMAGE,
        data?.formData,
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
export const addProjectManagerAction = createAsyncThunk(
  'tasks/add-project-manager',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(backendUrls.projects.ADDPROJECTMANAGER, data.content, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      return res?.data?.result;
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
export const deleteProjectManagerAction = createAsyncThunk(
  'tasks/delete-project-manager',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(
        backendUrls.projects.REMOVEPROJECTMANAGER,
        data.content,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );
      return res?.data?.result;
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
export const addProjectContributorsAction = createAsyncThunk(
  'tasks/add-project-manager',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(
        backendUrls.projects.ADDPROJECTCONTRIBUTORS,
        data.content,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );
      return res?.data?.result;
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
export const deleteProjectContributorAction = createAsyncThunk(
  'tasks/delete-project-manager',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(
        backendUrls.projects.REMOVEPROJECTCONTRIBUTOR,
        data.content,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );
      return res?.data?.result;
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

import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendUrls } from '../../../../api/urls';
import { startLoading, stopLoading } from '../loader/loader.slice';
import { toast } from 'react-toastify';
import { getProjectDetailsAction } from '../projects/projects.action';
import axiosInstance from '../../../../api/axiosConfig';

export const addSectionAction = createAsyncThunk(
  'tasks/add-section',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.post(`${backendUrls.tasks.ADDSECTION}`, data.content, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      axiosInstance.get(`${backendUrls.projects.GETPROJECTDETAILS(data.content.projectId)}`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      toast.success('Section Added!');
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
export const deleteSectionAction = createAsyncThunk(
  'tasks/delete-section',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.delete(backendUrls.tasks.DELETESECTION(data.id), {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      return res?.data?.success;
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
export const addTaskAction = createAsyncThunk('tasks/add-tasks', async (data: any, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  dispatch(startLoading());
  try {
    const res = await axiosInstance.post(`${backendUrls.tasks.ADDTASK}`, data.formData, {
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
});
export const editTaskAction = createAsyncThunk('tasks/edit-tasks', async (data: any, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  dispatch(startLoading());
  const { formData, token, id } = data;
  try {
    const res = await axiosInstance.patch(backendUrls.tasks.EDITTASK(id), formData, {
      headers: {
        Authorization: `Bearer ${token}`,
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
});
export const deleteAssigneeAction = createAsyncThunk(
  'tasks/delete-task-assignee',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(backendUrls.tasks.DELETEASSIGNEE, data.content, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      toast.success('Assignee Deleted!');
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
export const getTaskDetailsAction = createAsyncThunk(
  'tasks/task-details',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.get(backendUrls.tasks.GETTASKDETAILS(data.id), {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      return res?.data?.task;
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
export const toggleSubTaskStatusAction = createAsyncThunk(
  'tasks/toggle-subtask-status',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(backendUrls.tasks.TOGGLESUBTASKSTATUS(data.id), {
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

export const deleteSubtaskAction = createAsyncThunk(
  'tasks/delete-subtask',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(backendUrls.tasks.DELETESUBTASK, data.content, {
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
export const editSubtaskAction = createAsyncThunk(
  'tasks/edit-subtask',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(backendUrls.tasks.EDITSUBTASK, data.content, {
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
export const deleteTaskAction = createAsyncThunk(
  'tasks/delete-task',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.delete(backendUrls.tasks.DELETETASK(data.id), {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      return res?.data?.success;
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
export const deleteTaskFileAction = createAsyncThunk(
  'tasks/delete-task-file',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(backendUrls.tasks.DELETETASKFILE, data.content, {
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

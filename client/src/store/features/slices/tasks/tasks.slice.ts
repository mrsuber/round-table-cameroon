import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BaseResponseType } from '../../../store.types';
import { addSectionAction, getTaskDetailsAction } from './tasks.action';

interface ProjectsType extends BaseResponseType {
  tasks: any;
  taskDetail: any;
  taskError: any;
}

const initialState: ProjectsType = {
  loading: false,
  error: null,
  tasks: null,
  taskDetail: null,
  taskError: null,
};
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: {
    [addSectionAction.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.loading = false;
      state.tasks = payload;
      state.taskError = null;
    },
    [addSectionAction.rejected.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.taskError = payload;
      state.loading = false;
    },
    [getTaskDetailsAction.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.loading = false;
      state.taskDetail = payload;
      state.taskError = null;
    },
    [getTaskDetailsAction.rejected.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.taskError= payload;
      state.loading = false;
    },
  },
});
export default tasksSlice.reducer;

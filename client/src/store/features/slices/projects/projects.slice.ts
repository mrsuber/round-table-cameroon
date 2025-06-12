import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addProjectAction, getProjectsAction } from './projects.action';
import { BaseResponseType } from '../../../store.types';

interface ProjectsType extends BaseResponseType {
  projects: any;
  allProjects: any;
  project: any;
  successMessage: string
}

const initialState: ProjectsType = {
  loading: false,
  error: null,
  projects: null,
  allProjects: null,
  project: null,
  successMessage: '',
  projectError: null
};
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: {
    [getProjectsAction.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.loading = false;
      state.projects = payload;
      state.projectError = null;
    },
    [getProjectsAction.rejected.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.projectError = payload;
      state.loading = false;
    },
    [addProjectAction.fulfilled.toString()]: (
      state,
      { payload }: any,
    ) => {
      state.loading = false;
      state.successMessage = payload;
      state.projectError = null;
    },
    [addProjectAction.rejected.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.projectError = payload;
      state.loading = false;
    },
  },
});
export default projectsSlice.reducer;

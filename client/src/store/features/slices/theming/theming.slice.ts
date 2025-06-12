import { createSlice } from '@reduxjs/toolkit';
import logo from '../../../../assets/images/logo.svg';
import bgImage from '../../../../static/assets/images/RT/monument.jpeg';

export interface LoaderState {
  loading?: boolean;
  theming: {
    logo?: any;
    bgImage?: string;
    color?: string;
  };
}
const initialState: LoaderState = {
  loading: false,
  theming: {
    logo,
    bgImage,
    color: '0, 38, 42',
  },
};
export const themingSlice = createSlice({
  name: 'theming',
  initialState,
  reducers: {
    setTheming: (state, { payload }) => {
      state.theming = payload;
    },
  },
});

export const { setTheming } = themingSlice.actions;

export default themingSlice.reducer;

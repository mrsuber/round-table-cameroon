import { createSlice } from '@reduxjs/toolkit'

export interface LoaderState {
  loading?: boolean
}
const initialState: LoaderState = {
  loading: false,
}
export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    startLoading: () => ({ loading: true }),
    stopLoading: () => ({ loading: false }),
  },
})

export const { startLoading, stopLoading } = loaderSlice.actions

export default loaderSlice.reducer

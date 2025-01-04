import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface initialStateTypes {
  isTaskbarCollabsed: boolean;
  isDarkMode: boolean;
}

const initialState: initialStateTypes = {
  isTaskbarCollabsed: false,
  isDarkMode: false,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIsTaskbarCollabsed: (state, action: PayloadAction<boolean>) => {
      state.isTaskbarCollabsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { setIsTaskbarCollabsed, setIsDarkMode } = globalSlice.actions;
export default globalSlice.reducer;

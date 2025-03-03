import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  id: number | null;
  username: string | null;
  companyId: number | null;
};

const initialState: UserState = {
  id: null,
  username: null,
  companyId: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ id: number; username: string, companyId: number }>
    ) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.companyId = action.payload.companyId;
    },
    clearUser: (state) => {
      state.id = null;
      state.username = null;
      state.companyId = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../types/userInterface';

const initialState = {
  nickname: '',
  email: '',
  point: 0,
  isLogin: false,
  auth: '',
  calendarId: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IUser>) => {
      state.nickname = action.payload.nickname;
      state.email = action.payload.email;
      state.point = action.payload.point;
      state.auth = action.payload.auth;
      state.calendarId = action.payload.calendarId;
      state.isLogin = true;
    },
    logout: (state) => {
      state.nickname = '';
      state.email = '';
      state.point = 0;
      state.auth = '';
      state.isLogin = false;
    },
    addPoint: (state, action: PayloadAction<number>) => {
      state.point += action.payload;
    },
    minusPoint: (state, action: PayloadAction<number>) => {
      state.point -= action.payload;
    },
    changeNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
    },
    changeCalendarId: (state, action: PayloadAction<string>) => {
      state.calendarId = action.payload;
    },
  },
});

export const {
  login,
  logout,
  addPoint,
  minusPoint,
  changeNickname,
  changeCalendarId,
} = userSlice.actions;
export default userSlice.reducer;

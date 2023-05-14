import { createSlice } from "@reduxjs/toolkit";
import { singIn, singOut, singUp, updateAvatar } from "./authOperations";

const initialState = {
  id: null,
  name: null,
  email: null,
  avatar: null,
  token: null,
  isLogedIn: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    refreshUser: (state, { payload }) => {
        state.id = payload.id;
      state.name = payload.name;
      state.email = payload.email;
      state.avatar = payload.avatar;
      state.token = payload.token;
      state.isLogedIn = true;
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(singUp.pending, (state) => {
        state.error = null;
      })
      .addCase(singUp.fulfilled, (state, { payload }) => {
        state.id = payload.id;
        state.name = payload.name;
        state.email = payload.email;
        state.avatar = payload.avatar;
        state.token = payload.token;
        state.isLogedIn = true;
      })
      .addCase(singUp.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(singIn.pending, (state) => {
        state.error = null;
      })
      .addCase(singIn.fulfilled, (state, { payload }) => {
        state.id = payload.id;
        state.name = payload.name;
        state.email = payload.email;
        state.avatar = payload.avatar;
        state.token = payload.token;
        state.isLogedIn = true;
      })
      .addCase(singIn.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(singOut.pending, (state) => {
        state.error = null;
      })
      .addCase(singOut.fulfilled, (state) => {
        state.id = null;
        state.name = null;
        state.email = null;
        state.avatar = null;
        state.token = null;
        state.isLogedIn = false;
      })
      .addCase(singOut.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(updateAvatar.pending, (state) => {
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.avatar = payload.avatar;
      })
      .addCase(updateAvatar.rejected, (state, { payload }) => {
        state.error = payload;
      }),
});

export const { refreshUser } = authSlice.actions;

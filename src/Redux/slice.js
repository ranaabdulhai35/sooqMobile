import {createSlice} from '@reduxjs/toolkit';

export const AuthSlice = createSlice({
  name: 'auth',
  // initialState,
  initialState: {
    token: null,
    darkTheme: false,
    user: null,
    cartItems: 0,
    favourites: [],
    categoryOption: null,
    language: 'en',
    pfp: null,
  },
  reducers: {
    log_in: {
      reducer: (state, action) => {
        state.token = action.payload;
      },
    },
    log_out: {
      reducer: (state, action) => {
        state.token = null;
        state.user = null;
        state.favourites = [];
        state.categoryOption = null;
        state.socket = null;
      },
    },
    setDarkTheme: {
      reducer: (state, action) => {
        state.darkTheme = action.payload;
      },
    },
    setUser: {
      reducer: (state, action) => {
        state.user = action.payload;
      },
    },
    setCartItems: {
      reducer: (state, action) => {
        state.cartItems = action.payload;
      },
    },
    setFavourites: {
      reducer: (state, action) => {
        state.favourites = action.payload;
      },
    },
    setCategory: {
      reducer: (state, action) => {
        state.categoryOption = action.payload;
      },
    },
    setLanguage: {
      reducer: (state, action) => {
        state.language = action.payload;
      },
    },
    setPfp: {
      reducer: (state, action) => {
        state.pfp = action.payload;
      },
    },
  },
});

/*
import {configreStore} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: [],
  reducers: {
    addUser: (state, action) => {
      state.push(action.payload)
    }
  }
})

const store = configreStore({
  reducer: {
    user: userSlice.reducer
  }
})
export default store */
/*
import { configureStore, createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      state.push(action.payload);
    }
  }
});

export const { addUser } = userSlice.actions; // ✅ export action

const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

export default store;
*/

import { configureStore, createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {}, // one user or null
  reducers: {
    addUser: (state, action) => {
      return action.payload;  // replace old user with new user
    }
  }
});

export const { addUser } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

export default store;
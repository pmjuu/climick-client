/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  time: 0,
  hp: 0,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setName(state, action) {
      state.name = action.payload;
    },
    setTime(state, action) {
      state.time = action.payload;
    },
  },
});

export const { setName, setTime } = playerSlice.actions;
export default playerSlice.reducer;

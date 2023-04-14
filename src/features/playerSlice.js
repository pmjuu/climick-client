/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  time: 0,
  hp: 0,
  isRankingOpened: false,
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
    setIsRankingOpened(state, action) {
      state.isRankingOpened = action.payload;
    },
  },
});

export const { setName, setTime, setIsRankingOpened } = playerSlice.actions;
export default playerSlice.reducer;

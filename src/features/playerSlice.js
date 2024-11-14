/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  time: 0,
  hp: 100,
  gameStatus: {
    start: false,
    fail: false,
    success: false,
  },
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
    setHp(state, action) {
      state.hp = action.payload;
    },
    controlHp(state, action) {
      state.hp += action.payload;
    },
    setGameStatus(state, action) {
      const { target, status } = action.payload;
      state.gameStatus[target] = status;
    },
    setIsRankingOpened(state, action) {
      state.isRankingOpened = action.payload;
    },
  },
});

export const {
  setName,
  setTime,
  setHp,
  controlHp,
  setGameStatus,
  setIsRankingOpened,
} = playerSlice.actions;
export default playerSlice.reducer;

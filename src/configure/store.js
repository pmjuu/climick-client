import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import playerReducer from "../features/playerSlice";

const store = configureStore({
  reducer: {
    player: playerReducer,
  },
  middleware: [logger],
});

export default store;

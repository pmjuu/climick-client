/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-debugger */
import { useDispatch } from "react-redux";
import styled from "styled-components";
import normalHolds from "../assets/hold/normal";
import { setGameStatus } from "../features/playerSlice";
import Player from "../utils/player";
import GameSideBar from "./GameSideBar";
import Wall from "./common/Wall";

export default function Game() {
  const dispatch = useDispatch();
  const updateGameStatus = (target, status) => {
    dispatch(setGameStatus({ target, status }));
  };

  const player = new Player(normalHolds, updateGameStatus);

  return (
    <Wrapper>
      <Wall playerContainer={player.container} holdData={normalHolds} />
      <GameSideBar
        onClickRestart={player.resetPosition}
        failWithMessage={player.failWithMessage}
        // getPlayerStatus={getPlayerStatus}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;
`;

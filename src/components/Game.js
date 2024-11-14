/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-debugger */
import { useDispatch } from "react-redux";
import styled from "styled-components";
import normalHolds from "../assets/hold/normal";
import Player from "../entity/player";
import { setGameStatus } from "../features/playerSlice";
import createHoldContainer from "../utils/hold";
import GameSideBar from "./GameSideBar";
import Wall from "./common/Wall";

export default function Game() {
  const dispatch = useDispatch();
  const updateGameStatus = (target, status) => {
    dispatch(setGameStatus({ target, status }));
  };

  const holdContainer = createHoldContainer(normalHolds);
  const player = new Player(normalHolds, holdContainer, updateGameStatus);

  return (
    <Wrapper>
      <Wall holdContainer={holdContainer} playerContainer={player.container} />
      <GameSideBar
        onGameEnd={player.onGameEnd}
        getPlayerStatus={player.getPlayerStatus}
        resetPlayerPosition={player.resetPosition}
        failWithMessage={player.failWithMessage}
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

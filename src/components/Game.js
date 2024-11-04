/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import normalHolds from "../assets/hold/normal";
import Player from "../utils/player";
import GameSideBar from "./GameSideBar";
import Wall from "./common/Wall";

export default function Game() {
  const player = new Player(normalHolds);
  const getPlayerStatus = () => {
    return true;
  };

  return (
    <Wrapper>
      <Wall playerContainer={player.container} holdData={normalHolds} />
      <GameSideBar
        onClickRestart={player.resetPosition}
        failWithMessage={player.failWithMessage}
        getPlayerStatus={getPlayerStatus}
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

import styled from "styled-components";
import { SIZE } from "../assets/constants";
import ClimbingWall from "./ClimbingWall";
import GameSideBar from "./GameSideBar";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;

  .game-display {
    width: 950px;
    height: ${SIZE.GAME_HEIGHT}px;
    background-color: #999;
  }
`;

export default function Game() {
  return (
    <Wrapper>
      <div className="wall">
        <ClimbingWall />
      </div>
      <GameSideBar />
    </Wrapper>
  );
}

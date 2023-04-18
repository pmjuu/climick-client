/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import { Application } from "pixi.js";
import { useEffect, useRef } from "react";
import GameSideBar from "./GameSideBar";
import { holdContainer } from "../utils/hold";
import playerContainer from "../utils/player";
import { COLOR, SIZE } from "../assets/constants";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;

  .wall {
    width: ${SIZE.GAME_WIDTH}px;
    height: ${SIZE.GAME_HEIGHT}px;
    background-color: ${COLOR.GAME_BACKGROUND};
  }
`;

export default function Game() {
  const app = new Application({
    width: SIZE.GAME_WIDTH,
    height: SIZE.GAME_HEIGHT,
    backgroundAlpha: 0,
  });
  app.stage.addChild(holdContainer);
  app.stage.addChild(playerContainer);

  const wallRef = useRef();

  useEffect(() => {
    const wall = wallRef.current;

    if (wall.firstChild) wall.removeChild(wall.firstChild);

    wall.appendChild(app.view);
  }, []);

  return (
    <Wrapper>
      <div className="wall" ref={wallRef} />
      <GameSideBar />
    </Wrapper>
  );
}

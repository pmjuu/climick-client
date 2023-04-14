/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import { Application } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import GameSideBar from "./GameSideBar";
import { setFirstSuccess, setTime } from "../features/playerSlice";
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
  }
`;

export default function Game() {
  const dispatch = useDispatch();

  const app = new Application({
    width: SIZE.GAME_WIDTH,
    height: SIZE.GAME_HEIGHT,
    backgroundColor: COLOR.GAME_BACKGROUND,
  });
  app.stage.addChild(holdContainer);
  app.stage.addChild(playerContainer);

  const wallRef = useRef();

  useEffect(() => {
    const wall = wallRef.current;

    if (wall.firstChild) wall.removeChild(wall.firstChild);

    wall.appendChild(app.view);

    const startTimer = () => {
      if (!wall.getAttribute("result")) return;

      let tick = 1;
      const timerInterval = setInterval(() => {
        if (wall.getAttribute("result") === "fail") {
          clearInterval(timerInterval);
        }
        if (wall.getAttribute("result") === "success") {
          clearInterval(timerInterval);
          dispatch(setFirstSuccess(true));
        }

        dispatch(setTime(tick));
        tick += 1;
      }, 1000);

      wall.removeEventListener("click", startTimer);
    };

    wall.addEventListener("click", startTimer);
  }, []);

  return (
    <Wrapper>
      <div className="wall" ref={wallRef} />
      <GameSideBar />
    </Wrapper>
  );
}

import styled from "styled-components";
import { Application } from "pixi.js";
import { holdContainer } from "../utils/hold";
import playerContainer from "../utils/player";
import { SIZE } from "../assets/constants";

const Wrapper = styled.div``;

export default function ClimbingWall() {
  const app = new Application({
    width: 950,
    height: SIZE.GAME_HEIGHT,
    backgroundColor: "#bbb",
  });
  app.stage.addChild(holdContainer);
  app.stage.addChild(playerContainer);

  setTimeout(() => {
    const wall = document.querySelector(".wall");

    if (wall.firstChild) wall.removeChild(wall.firstChild);

    wall.appendChild(app.view);
  }, 0);

  return (
    <Wrapper>
      <div className="-" />
    </Wrapper>
  );
}

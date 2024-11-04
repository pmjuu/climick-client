import { Application } from "pixi.js";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { COLOR, SIZE } from "../../assets/constants";
import createHoldContainer from "../../utils/hold";

export default function Wall({ playerContainer, holdData }) {
  const app = new Application({
    width: SIZE.GAME_WIDTH,
    height: SIZE.GAME_HEIGHT,
    backgroundAlpha: 0,
  });
  const holdContainer = createHoldContainer(holdData);

  app.stage.addChild(holdContainer);
  app.stage.addChild(playerContainer);

  const wallRef = useRef();
  useEffect(() => {
    const wall = wallRef.current;

    // TODO: 지금은 지워도 문제 없어 보임. 추후 삭제 필요
    if (wall.firstChild) wall.removeChild(wall.firstChild);

    wall.appendChild(app.view);
  }, []);

  return <WallDiv className="wall" ref={wallRef} />;
}

const WallDiv = styled.div`
  width: ${SIZE.GAME_WIDTH}px;
  height: ${SIZE.GAME_HEIGHT}px;
  background-color: ${COLOR.GAME_BACKGROUND};
`;

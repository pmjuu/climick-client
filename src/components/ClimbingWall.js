import { Application } from "pixi.js";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setTime } from "../features/playerSlice";
import { holdContainer } from "../utils/hold";
import playerContainer from "../utils/player";
import { SIZE } from "../assets/constants";

export default function ClimbingWall() {
  const dispatch = useDispatch();
  const app = new Application({
    width: 950,
    height: SIZE.GAME_HEIGHT,
    backgroundColor: "#99abba",
  });
  app.stage.addChild(holdContainer);
  app.stage.addChild(playerContainer);

  const wallRef = useRef();

  useEffect(() => {
    const wall = wallRef.current;

    if (wall.firstChild) wall.removeChild(wall.firstChild);

    wall.appendChild(app.view);
    const startTimer = () => {
      if (wall.firstChild.style.cursor !== "grab") return;

      let tick = 1;

      const timerInterval = setInterval(() => {
        dispatch(setTime(tick));
        tick += 1;
      }, 1000);

      wall.removeEventListener("pointerdown", startTimer);
    };

    wall.addEventListener("pointerdown", startTimer);
  }, [app.view, dispatch]);

  return <div className="game-display" ref={wallRef} />;
}

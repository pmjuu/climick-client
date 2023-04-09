import { useRef } from "react";
import styled from "styled-components";
import Climber from "./Climber";

const Wrapper = styled.div``;

export default function ClimbingWall() {
  const gameRef = useRef();

  return (
    <Wrapper>
      <div className="wall" ref={gameRef} />
      <Climber gameRef={gameRef} />
    </Wrapper>
  );
}

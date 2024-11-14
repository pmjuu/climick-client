import styled from "styled-components";
import practiceHolds from "../assets/hold/practice";
import Player from "../entity/player";
import GameStart from "./common/GameStart";
import Wall from "./common/Wall";

export default function Practice() {
  const player = new Player(practiceHolds);

  return (
    <Wrapper>
      <Title>Practice</Title>
      <Wall playerContainer={player.container} holdData={practiceHolds} />
      <GameStart />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 3rem;
`;

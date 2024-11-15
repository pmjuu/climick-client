import { useDispatch } from "react-redux";
import styled from "styled-components";
import practiceHolds from "../assets/hold/practice";
import HoldMap from "../entity/holdMap";
import Player from "../entity/player";
import { setGameStatus } from "../features/playerSlice";
import GameStart from "./common/GameStart";
import Wall from "./common/Wall";

export default function Practice() {
  const dispatch = useDispatch();
  const updateGameStatus = (target, status) => {
    dispatch(setGameStatus({ target, status }));
  };

  const holdContainer = new HoldMap(practiceHolds).container;
  const player = new Player(
    practiceHolds,
    holdContainer,
    updateGameStatus,
    true
  );

  return (
    <Wrapper>
      <Title>Practice</Title>
      <Wall holdContainer={holdContainer} playerContainer={player.container} />
      <GameStart />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 3rem;
`;

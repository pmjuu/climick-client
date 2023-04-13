import styled from "styled-components";
import { SIZE } from "../assets/constants";

const Wrapper = styled.div`
  position: absolute;
  top: 200px;
  width: ${SIZE.GAME_WIDTH}px;
  text-align: center;
  color: rgba(0, 0, 0, 0.3);
  font-weight: 700;
  font-size: 10rem;
  letter-spacing: 0.5rem;
`;

export default function GameResult({ result }) {
  return <Wrapper>{result}</Wrapper>;
}

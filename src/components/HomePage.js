import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import GameStart from "./common/GameStart";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;

  .title {
    color: #fff;
    font-size: 7rem;
  }
`;

export default function HomePage() {
  const navigate = useNavigate();
  localStorage.removeItem("climick-name");

  const clickInstruction = () => navigate("/instruction");

  return (
    <Wrapper>
      <h1 className="title">Climick</h1>
      <GameStart />
      <button className="button" onClick={clickInstruction}>
        Instruction
      </button>
    </Wrapper>
  );
}

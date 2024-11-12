import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setName } from "../features/playerSlice";
import GameStart from "./common/GameStart";

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  dispatch(setName(""));
  localStorage.removeItem("climick-name");

  const clickInstruction = () => navigate("/instruction");
  const clickPractice = () => navigate("/practice");

  return (
    <Wrapper>
      <Title>Climick</Title>
      <NavigateButton className="button" onClick={clickInstruction}>
        Instruction
      </NavigateButton>
      <NavigateButton className="button" onClick={clickPractice}>
        Practice
      </NavigateButton>
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
  text-align: center;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 7rem;
`;

const NavigateButton = styled.button`
  margin: 10px 0;
`;

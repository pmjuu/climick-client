import { Link } from "react-router-dom";
import styled from "styled-components";

const GameStartContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 220px;
  height: 62px;
  margin: 10px 0;
  text-align: center;
  overflow: hidden;
  transition: all 0.4s;

  :hover {
    width: 560px;
  }

  input {
    width: 260px;
    height: 60px;
    padding: 0 30px;
    margin-right: 10px;
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    color: #fff;
    text-align: center;
    font-size: 2rem;
    transition: all 0.4s;

    ::-webkit-input-placeholder {
      padding: 0 20px;
      color: #fff;
      font-size: 1.5rem;
      text-align: left;
    }

    :hover {
      background-color: rgba(255, 255, 255, 0.4);

      ::-webkit-input-placeholder {
        color: #333;
        text-align: center;
      }
    }

    :focus {
      background-color: rgba(0, 0, 0, 0);
      border-bottom: 1px solid white;
      outline: none;
    }
  }
`;

export default function GameStart() {
  return (
    <GameStartContainer>
      <input placeholder="enter name" />
      <Link to="/game" className="button">
        Game START
      </Link>
    </GameStartContainer>
  );
}

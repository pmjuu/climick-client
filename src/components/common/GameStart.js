import { Link } from "react-router-dom";
import styled from "styled-components";

const GameStartContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 60px;
  margin: 10px 0;
  text-align: center;

  input {
    width: 300px;
    height: 100%;
    padding: 0 10px;
    margin-right: 10px;
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    text-align: center;
    font-size: 2rem;
    transition: all 0.4s;

    ::-webkit-input-placeholder {
      font-size: 1.5rem;
    }

    :hover {
      background-color: rgba(255, 255, 255, 0.4);

      ::-webkit-input-placeholder {
        color: rgb(50, 50, 50);
      }
    }

    :focus {
      outline: none;
      border-bottom: 1px solid white;
      background-color: rgba(0, 0, 0, 0);
    }
  }
`;

export default function GameStart() {
  return (
    <GameStartContainer>
      <input placeholder="please enter player's name" />
      <Link to="/game" className="button">
        Game START
      </Link>
    </GameStartContainer>
  );
}

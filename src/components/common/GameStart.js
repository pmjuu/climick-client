import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setName } from "../../features/playerSlice";

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
    width: 520px;
  }

  input {
    width: 220px;
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

  .button:hover {
    cursor: ${props => (props.name ? "pointer" : "not-allowed")};
  }
`;

export default function GameStart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = useSelector(state => state.player.name);

  const handleInput = e => dispatch(setName(e.target.value.trim()));
  const handleGameStart = () => {
    if (!name) return;

    localStorage.setItem("climick-name", name);
    navigate("/game");
  };

  return (
    <GameStartContainer name={name}>
      <input placeholder="enter name" onChange={handleInput} />
      <button className="button" onClick={handleGameStart}>
        Game&nbsp;START
      </button>
    </GameStartContainer>
  );
}

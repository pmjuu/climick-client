import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFirstSuccess, setName } from "../features/playerSlice";
import { SIZE } from "../assets/constants";
import Modal from "./Modal";
import Ranking from "./Ranking";

const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 400px;
  height: ${SIZE.GAME_HEIGHT}px;

  .status-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 300px;
    background-color: rgba(30, 30, 30, 0.9);
    color: #fff;
    font-size: 2.5rem;

    .row {
      margin: 10px 15px;
    }

    .category {
      margin-right: 10px;
      font-weight: 700;
    }

    .hp-bar {
      width: 366px;
      height: 30px;
      background-color: #44d;
      border: 1px solid #fff;
    }
  }

  .button {
    margin-top: 5px;
    padding: 0;
    width: 100%;
  }
`;

export default function GameSideBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = useSelector(state => state.player.name);
  const localStorageName = localStorage.getItem("climick-name");

  if (!name) dispatch(setName(localStorageName));

  useEffect(() => {
    if (!name) {
      alert("please enter the player's name");
      navigate("/");
    }
  }, [name, navigate]);

  const gameResult = useSelector(state => state.player.result);
  const [isModalOpened, setIsModalOpened] = useState(false);

  useEffect(() => {
    if (gameResult === "success") {
      setTimeout(() => {
        setIsModalOpened(true);
        dispatch(setFirstSuccess(false));
      }, 1000 * 1);
    }
  }, [gameResult, dispatch]);

  const closeModal = () => setIsModalOpened(false);
  const clickRanking = () => setIsModalOpened(true);
  const clickHomePage = () => {
    navigate("/");
  };
  const clickRestart = () => window.location.reload();

  const time = useSelector(state => state.player.time);
  const second = String(time % 60).padStart(2, "00");
  const minute = String(parseInt(time / 60, 10)).padStart(2, "00");

  return (
    <SideBar>
      <div className="status-box">
        <div className="row">
          <span className="category">Name</span>
          <span>{name}</span>
        </div>
        <div className="row">
          <span className="category">Time</span>
          <span>
            {minute}:{second}
          </span>
        </div>
        <div className="row">
          <span className="category">HP</span>
        </div>
        <div className="row hp-bar" />
      </div>
      <div className="button-section">
        <button className="button" onClick={clickRanking}>
          🏆 Ranking
        </button>
        <button className="button" onClick={clickHomePage}>
          🏠 Home Page
        </button>
        <button className="button" onClick={clickRestart}>
          Restart
        </button>
      </div>
      {isModalOpened && (
        <Modal closeModal={closeModal}>
          <Ranking />
        </Modal>
      )}
    </SideBar>
  );
}

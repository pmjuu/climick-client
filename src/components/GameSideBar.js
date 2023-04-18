/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setName,
  setTime,
  setHp,
  controlHp,
  setIsRankingOpened,
} from "../features/playerSlice";
import playerContainer, {
  attachedStatus,
  containerPosition,
  gameStatus,
  initialContainerHeight,
  leftShoulder,
} from "../utils/player";
import getResultText from "../utils/getResultText";
import customAxios from "../utils/customAxios";
import { SIZE, TIME_LIMIT } from "../assets/constants";
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
    height: 270px;
    background-color: rgba(30, 30, 30, 0.9);
    color: #fff;
    font-size: 2.5rem;

    .row {
      display: flex;
      align-items: center;
      margin: 10px 15px;

      .category {
        margin-right: 10px;
        font-weight: 700;
      }

      .name {
        width: 250px;
        text-overflow: clip;
        overflow: scroll;
        white-space: nowrap;
      }
    }

    .hp-box {
      width: 366px;
      height: 30px;
      background-color: #fff;
      border: 1px solid #fff;
    }

    .hp-bar {
      width: ${props => props.hp}%;
      height: 30px;
      background-color: ${props => props.hpColor};
      transition: 0.4s all ease;
    }

    .hp-text {
      font-size: 1rem;
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

  if (!name && localStorageName) dispatch(setName(localStorageName));

  useEffect(() => {
    if (!name) {
      alert("please enter the player's name");
      navigate("/");
      window.location.reload();
    }
  }, []);

  const isRankingOpened = useSelector(state => state.player.isRankingOpened);
  const [isModalOpened, setIsModalOpened] = useState(false);

  useEffect(() => {
    if (isRankingOpened === true) {
      setTimeout(() => {
        setIsModalOpened(true);
        dispatch(setIsRankingOpened(false));
      }, 1000 * 1);
    }
  }, [isRankingOpened, dispatch]);

  const closeModal = () => setIsModalOpened(false);
  const clickRanking = () => setIsModalOpened(true);
  const clickHomePage = () => {
    navigate("/");
    window.location.reload();
  };
  const clickRestart = () => window.location.reload();

  const [hpColor, setHpColor] = useState("#33c");
  const hp = useSelector(state => state.player.hp);
  const time = useSelector(state => state.player.time);
  const second = String(time % 60).padStart(2, "00");
  const minute = String(parseInt(time / 60, 10)).padStart(2, "00");

  useEffect(() => {
    let tick = 0;
    const timerInterval = setInterval(() => {
      if (!gameStatus.start) return;

      if (gameStatus.fail || gameStatus.success || gameStatus.timeover) {
        clearInterval(timerInterval);
        playerContainer.eventMode = "none";
        dispatch(setIsRankingOpened(true));
        return;
      }

      tick += 1;
      dispatch(setTime(tick));
    }, 1000);
  }, []);

  useEffect(() => {
    if (!gameStatus.start) return;

    if (hp <= 0) {
      dispatch(setHp(0));

      let descentVelocity = 0;

      const gravity = setInterval(() => {
        descentVelocity += 0.2;
        playerContainer.y += descentVelocity * 0.2;

        const isPlayerAboveGround =
          playerContainer.y <
          containerPosition.y -
            leftShoulder.y +
            (initialContainerHeight - playerContainer.height);

        if (!isPlayerAboveGround) {
          clearInterval(gravity);
          gameStatus.fail = true;
          playerContainer.addChild(getResultText("Fail..."));
        }
      }, 10);

      return;
    }

    if (time >= TIME_LIMIT) {
      gameStatus.timeover = true;
      playerContainer.addChild(getResultText("Time Over"));
      return;
    }

    if (gameStatus.success === true) registerSuccess();

    if (attachedStatus.leftHand === 0 || attachedStatus.rightHand === 0) {
      dispatch(controlHp((-3 * 100) / TIME_LIMIT));
      setHpColor("goldenrod");
    } else {
      dispatch(controlHp((-1 * 100) / TIME_LIMIT));
      setHpColor(hp + (-1 * 100) / TIME_LIMIT > 20 ? "#33c" : "darkred");
    }
  }, [time]);

  async function registerSuccess() {
    try {
      const playerInfo = { name, time };
      await customAxios.post(
        `${process.env.REACT_APP_SERVER_URL}/players`,
        playerInfo
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <SideBar hp={hp} hpColor={hpColor}>
      <div className="status-box">
        <div className="row">
          <span className="category">Name</span>
          <span className="name">{name}</span>
        </div>
        <div className="row">
          <span className="category">Time</span>
          <span>
            {minute}:{second}
          </span>
        </div>
        <div className="row">
          <span className="category">HP</span>
          <span className="hp-text">{hp.toFixed(0)}%</span>
        </div>
        <div className="row hp-box">
          <div className="hp-bar" />
        </div>
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

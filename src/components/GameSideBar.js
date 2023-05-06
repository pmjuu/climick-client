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
import Modal from "./Modal";
import Ranking from "./Ranking";
import { BODY, COLOR, SIZE, TIME_LIMIT } from "../assets/constants";
import customAxios from "../utils/customAxios";
import playerContainer, {
  fallDown,
  leftArmList,
  leftLegList,
  rightArmList,
  rightLegList,
  armSize,
  legSize,
  body,
  leftShoulder,
  rightShoulder,
  leftCoxa,
  rightCoxa,
} from "../utils/player";
import { gameStatus, attachedStatus } from "../utils/status";
import { instabilityWarning } from "../utils/text";
import drawLimb from "../utils/drawLimb";
import { getCos, getSin } from "../utils/math";

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

const HpBar = styled.div.attrs(props => ({
  style: {
    width: `${props.hp}%`,
    backgroundColor: props.hpColor,
  },
}))`
  height: 30px;
  transition: 0.4s all ease;
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
  const clickRestart = () => {
    dispatch(setTime(0));
    dispatch(setHp(100));
    gameStatus.start = false;
    gameStatus.fail = false;
    gameStatus.success = false;
    setHpColor(COLOR.HP_TWO_HAND);
    playerContainer.removeChild(instabilityWarning);

    leftShoulder.x = 40;
    leftShoulder.y = 0;
    rightShoulder.x = leftShoulder.x + BODY.WIDTH * getCos(body.angle);
    rightShoulder.y = leftShoulder.y + BODY.WIDTH * getSin(body.angle);
    leftCoxa.x =
      leftShoulder.x - BODY.HEIGHT * getSin(body.angle) + BODY.COXA_GAP;
    leftCoxa.y = leftShoulder.y + BODY.HEIGHT * getCos(body.angle);
    rightCoxa.x =
      rightShoulder.x - BODY.HEIGHT * getSin(body.angle) - BODY.COXA_GAP;
    rightCoxa.y = rightShoulder.y + BODY.HEIGHT * getCos(body.angle);
    body.position.set(leftShoulder.x, leftShoulder.y);

    drawLimb(...leftArmList, ...armSize, -1, 1, 40, 40);
    drawLimb(...rightArmList, ...armSize, 1, 1, 40, 30);
    drawLimb(...leftLegList, ...legSize, -1, -1, 50, 80);
    drawLimb(...rightLegList, ...legSize, 1, -1, 50, 80);
  };

  const time = useSelector(state => state.player.time);
  const second = String(time % 60).padStart(2, "00");
  const minute = String(parseInt(time / 60, 10)).padStart(2, "00");
  const [hpColor, setHpColor] = useState(COLOR.HP_TWO_HAND);
  const hp = useSelector(state => state.player.hp);

  useEffect(() => {
    let tick = 0;
    const timerInterval = setInterval(() => {
      if (!gameStatus.start) return;

      if (gameStatus.fail || gameStatus.success) {
        clearInterval(timerInterval);
        playerContainer.eventMode = "none";
        playerContainer.removeChild(instabilityWarning);
        return dispatch(setIsRankingOpened(true));
      }

      tick += 1;
      dispatch(setTime(tick));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if (!gameStatus.start) return;

    if (hp <= 0) {
      dispatch(setHp(0));
      return fallDown("Fail...");
    }

    if (time >= TIME_LIMIT) {
      return fallDown("Time Over");
    }

    if (
      attachedStatus.leftHand === 0 ||
      attachedStatus.rightHand === 0 ||
      attachedStatus.leftFoot === 0 ||
      attachedStatus.rightFoot === 0
    ) {
      dispatch(controlHp((-4 * 100) / TIME_LIMIT));
      setHpColor(
        hp + (-4 * 100) / TIME_LIMIT > 30 ? COLOR.HP_ONE_HAND : COLOR.HP_RISKY
      );
    } else {
      dispatch(controlHp((-1 * 100) / TIME_LIMIT));
      setHpColor(
        hp + (-1 * 100) / TIME_LIMIT > 30 ? COLOR.HP_TWO_HAND : COLOR.HP_RISKY
      );
    }

    if (!attachedStatus.isStable) {
      dispatch(controlHp((-2 * 100) / TIME_LIMIT));
      setHpColor(
        hp + (-2 * 100) / TIME_LIMIT > 30 ? COLOR.HP_UNSTABLE : COLOR.HP_RISKY
      );
    }
  }, [time]);

  useEffect(() => {
    if (gameStatus.success) {
      registerSuccess();
    }
  }, [gameStatus.success]);

  async function registerSuccess() {
    try {
      const playerInfo = { name, time, hp };
      await customAxios.post(
        `${process.env.REACT_APP_SERVER_URL}/players`,
        playerInfo
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <SideBar>
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
          <span className="hp-text">{hp > 0 ? hp.toFixed(0) : 0}%</span>
        </div>
        <div className="row hp-box">
          <HpBar hp={hp} hpColor={hpColor} />
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

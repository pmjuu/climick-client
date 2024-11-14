/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { COLOR, SIZE, TIME_LIMIT } from "../assets/constants";
import {
  setHp,
  setIsRankingOpened,
  setName,
  setTime,
} from "../features/playerSlice";
import customAxios from "../utils/customAxios";
import Modal from "./Modal";
import Ranking from "./Ranking";

export default function GameSideBar({ onClickRestart, failWithMessage }) {
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

  const time = useSelector(state => state.player.time);
  const second = String(time % 60).padStart(2, "00");
  const minute = String(parseInt(time / 60, 10)).padStart(2, "00");
  const [hpColor, setHpColor] = useState(COLOR.HP_TWO_HAND);
  const hp = useSelector(state => state.player.hp);
  const gameStatus = useSelector(state => state.player.gameStatus);

  useEffect(() => {
    let tick = 0;
    const timerInterval = setInterval(() => {
      if (!gameStatus.start) {
        return;
      }

      if (gameStatus.fail || gameStatus.success) {
        clearInterval(timerInterval);
        // playerContainer.eventMode = "none";
        // playerContainer.removeChild(instabilityWarning);
        return dispatch(setIsRankingOpened(true));
      }

      tick += 1;
      dispatch(setTime(tick));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameStatus.start]);

  useEffect(() => {
    if (!gameStatus.start) return;

    // if (getPlayerStatus() === "두손놓음") {
    //   return;
    // }

    if (hp <= 0) {
      dispatch(setHp(0));
      failWithMessage("Fail...", () => {
        dispatch(setName("Fail..."));
      });
      return;
    }

    if (time >= TIME_LIMIT) {
      failWithMessage("Time Over", () => {
        dispatch(setName("Time Over"));
      });
    }

    // if (
    //   !isAttached.leftHand ||
    //   !isAttached.rightHand ||
    //   !isAttached.leftFoot ||
    //   !isAttached.rightFoot
    // ) {
    //   dispatch(controlHp((-4 * 100) / TIME_LIMIT));
    //   setHpColor(
    //     hp + (-4 * 100) / TIME_LIMIT > 30 ? COLOR.HP_ONE_HAND : COLOR.HP_RISKY
    //   );
    // } else {
    //   dispatch(controlHp((-1 * 100) / TIME_LIMIT));
    //   setHpColor(
    //     hp + (-1 * 100) / TIME_LIMIT > 30 ? COLOR.HP_TWO_HAND : COLOR.HP_RISKY
    //   );
    // }

    // if (!isStable) {
    //   dispatch(controlHp((-2 * 100) / TIME_LIMIT));
    //   setHpColor(
    //     hp + (-2 * 100) / TIME_LIMIT > 30 ? COLOR.HP_UNSTABLE : COLOR.HP_RISKY
    //   );
    // }
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
      console.error(err); // eslint-disable-line no-console
    }
  }

  return (
    <SideBar>
      <StatusBox className="status-box">
        <Row>
          <Category>Name</Category>
          <PlayerName>{name}</PlayerName>
        </Row>
        <Row>
          <Category>Time</Category>
          <span>
            {minute}:{second}
          </span>
        </Row>
        <Row>
          <Category>HP</Category>
          <HpText>{hp > 0 ? hp.toFixed(0) : 0}%</HpText>
        </Row>
        <HpBox>
          <HpBar hp={hp} hpColor={hpColor} />
        </HpBox>
      </StatusBox>
      <div className="button-section">
        <Button className="button" onClick={clickRanking}>
          🏆 Ranking
        </Button>
        <Button className="button" onClick={clickHomePage}>
          🏠 Home Page
        </Button>
        <Button
          className="button"
          onClick={() => {
            dispatch(setTime(0));
            dispatch(setHp(100));
            setHpColor(COLOR.HP_TWO_HAND);

            onClickRestart();
          }}
        >
          Restart
        </Button>
      </div>
      {isModalOpened && (
        <Modal closeModal={closeModal}>
          <Ranking />
        </Modal>
      )}
    </SideBar>
  );
}

const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 400px;
  height: ${SIZE.GAME_HEIGHT}px;
`;

const StatusBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 270px;
  background-color: rgba(30, 30, 30, 0.9);
  color: #fff;
  font-size: 2.5rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 15px;
`;

const Category = styled.span`
  margin-right: 10px;
  font-weight: 700;
`;

const PlayerName = styled.span`
  width: 250px;
  text-overflow: clip;
  overflow: scroll;
  white-space: nowrap;
`;

const HpBox = styled(Row)`
  width: 366px;
  height: 30px;
  background-color: #fff;
  border: 1px solid #fff;
`;

const HpText = styled.span`
  font-size: 1rem;
`;

const Button = styled.button`
  margin-top: 5px;
  padding: 0;
  width: 100%;
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

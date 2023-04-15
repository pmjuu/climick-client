import { useEffect, useState } from "react";
import styled from "styled-components";
import customAxios from "../utils/customAxios";

const Wrapper = styled.div`
  .row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    font-size: 1.3rem;

    > div {
      width: 150px;
      padding: 3px 0;
      border: 1px solid #fff;
    }
  }

  .row.first {
    background-color: #bbb;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

export default function Ranking() {
  const [playerList, setPlayerList] = useState([]);

  function setRanking(p1, p2) {
    return p1.time - p2.time;
  }

  async function getPlayers() {
    try {
      const response = await customAxios.get(
        `${process.env.REACT_APP_SERVER_URL}/players`
      );
      const sortedPlayerList = response.data.players.sort(setRanking);
      const newPlayerList = sortedPlayerList.map(player => {
        const { time } = player;
        const second = String(time % 60).padStart(2, "00");
        const minute = String(parseInt(time / 60, 10)).padStart(2, "00");
        const timeString = `${minute}:${second}`;

        return { _id: player._id, name: player.name, time: timeString };
      });

      setPlayerList(newPlayerList);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getPlayers();
  }, []);

  return (
    <Wrapper>
      <h1>Ranking</h1>
      <div className="row first">
        <div>No.</div>
        <div>Name</div>
        <div>Time</div>
        <div>HP</div>
      </div>
      {playerList.map((player, index) => (
        <div className="row" key={player._id}>
          <div>{index + 1}</div>
          <div>{player.name}</div>
          <div>{player.time}</div>
          <div>-</div>
        </div>
      ))}
    </Wrapper>
  );
}

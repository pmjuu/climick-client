import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import customAxios from "../utils/customAxios";

export default function Ranking() {
  const [playerList, setPlayerList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  function setRanking(p1, p2) {
    if (p1.time === p2.time) {
      return p2.hp - p1.hp;
    }

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

        return {
          _id: player._id,
          name: player.name,
          time: timeString,
          hp: player.hp.toFixed(0),
        };
      });

      setPlayerList(newPlayerList);
    } catch (err) {
      if (err.response) {
        // Check if response exists
        if (err.response.status === 404) {
          setErrorMessage("Server is not connected");
        } else {
          setErrorMessage(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        // Request was made but no response was received
        setErrorMessage(
          "No response from the server. Please check your connection."
        );
      } else {
        // Something happened while setting up the request
        setErrorMessage("An unexpected error occurred.");
      }
    }
  }

  useEffect(() => {
    getPlayers();
  }, []);

  const name = useSelector(state => state.player.name);

  return (
    <Wrapper>
      <h1>Ranking</h1>
      <Table>
        <FirstRow>
          <div>No.</div>
          <div>Name</div>
          <div>Time</div>
          <div>HP</div>
        </FirstRow>
        {playerList.map((player, index) => (
          <Row key={player._id}>
            <div>{index + 1}</div>
            <div className={player.name === name ? "myName" : ""}>
              {player.name}
            </div>
            <div>{player.time}</div>
            <div>{player.hp}</div>
          </Row>
        ))}
      </Table>
      {errorMessage && errorMessage}
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Table = styled.div`
  max-height: 450px;
  border: 1px solid #ccc;
  overflow: scroll;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 50px 270px 100px 70px;
  font-size: 1.3rem;

  > div {
    padding: 3px 0;
    border: 1px solid #ccc;
  }

  .myName {
    color: royalblue;
    font-weight: 700;
  }
`;

const FirstRow = styled(Row)`
  background-color: #ddd;
  font-size: 1.5rem;
  font-weight: 600;
`;

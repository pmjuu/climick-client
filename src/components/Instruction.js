import styled from "styled-components";
import GameStart from "./common/GameStart";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    color: #fff;
    font-size: 3rem;
  }

  .instruction-container {
    width: 700px;
    padding: 5px;
    background-color: rgba(200, 200, 200, 0.85);
    border: solid 1px #fff;

    h2 {
      font-size: 1.7rem;
    }

    ul {
      width: 95%;
      padding: 0 35px;
      font-size: 1.5rem;
      white-space: pre-line;

      li {
        margin: 5px 0;
        list-style-type: "🪨 ";
      }
    }
  }
`;

export default function Instruction() {
  return (
    <Wrapper>
      <h1 className="title">Climick</h1>
      <div className="instruction-container">
        <h2>Instruction</h2>
        <ul>
          <li>
            start 홀드에서 손을 떼는 순간, 타이머가 작동하고 HP가 줄어들기
            시작합니다.
          </li>
          <li>top 홀드에 두 손을 모으면 완등입니다.</li>
          <li>drag & drop 으로 손발을 움직일 수 있습니다.</li>
          <li>
            drag & drop 시 손발은 홀드 위에만 올릴 수 있습니다. (벽 짚기 X)
          </li>
          <li>static 무브로 진행합니다. (점프 X)</li>
          <li>
            게임 진행 중에도 Restart 버튼을 누르면 다시 처음부터 시작할 수
            있습니다.
          </li>
          <li>플레이어는 최대 2분동안 버틸 수 있습니다.</li>
          <li>HP가 0이 되거나 양 손이 홀드에서 떨어지면 추락합니다.</li>
        </ul>
      </div>
      <GameStart />
    </Wrapper>
  );
}

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

    p {
      text-align: right;
    }

    ul {
      width: 95%;
      padding: 0 35px;
      font-size: 1.5rem;
      white-space: pre-line;

      li {
        margin: 10px 0;
        list-style-type: "🪨 ";

        + .warning {
          list-style-type: "⚠️ ";
        }
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
            플레이어를 클릭하면 타이머가 작동하고 HP가 줄어들기 시작합니다.
          </li>
          <li>TOP 홀드에 두 손을 모으면 완등입니다. (Success)</li>
          <li>플레이어의 손/발/몸통을 드래그해서 움직일 수 있습니다.</li>
          <li>
            하늘색 배경에 있는 모든 물체들은 잡거나 밟을 수 있는 홀드입니다.
          </li>
          <li>드래그앤 드롭 시 손발은 홀드 위에만 올릴 수 있습니다.</li>
          <li>플레이어는 최대 5분동안 버틸 수 있습니다.</li>
          <li className="warning">
            손/발이 홀드에서 떨어지거나 무게중심이 양 발 사이에 없으면
            <br /> HP가 빨리 줄어듭니다.
          </li>
          <li className="warning">
            HP가 0이 되거나 양 손이 홀드에서 떨어지면 추락합니다. (Fail)
          </li>
        </ul>
        <p>*홀드: 손발로 잡을 수 있는 벽에 붙어있는 돌 형태를 의미합니다.</p>
      </div>
      <GameStart />
    </Wrapper>
  );
}

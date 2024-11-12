import styled from "styled-components";
import GameStart from "./common/GameStart";

export default function Instruction() {
  return (
    <Wrapper>
      <Title>Climick</Title>
      <InstructionContainer>
        <h2>Instruction</h2>
        <InstructionText>
          <div>
            <List>
              <ListItem>
                When you click the player, a timer starts, and HP begins to
                decrease.
              </ListItem>
              <ListItem>
                You succeed by placing both hands on the top hold.
              </ListItem>
              <ListItem>
                You can drag the player’s hands, feet, or torso to move them.
              </ListItem>
              <ListItem>
                All objects against the sky-blue background are holds that can
                be grabbed or stepped on.
              </ListItem>
              <ListItem>
                When dragging and dropping, hands and feet can only be placed on
                holds.
              </ListItem>
              <ListItem>
                The player can hang on for a maximum of 5 minutes.
              </ListItem>
              <ListItem className="warning">
                HP decreases quickly if a hand or foot falls off a hold or if
                the center of gravity is not between the feet.
              </ListItem>
              <ListItem className="warning">
                If HP reaches zero or both hands fall off the holds, the player
                falls and fails.
              </ListItem>
            </List>
            <p>
              *A &quot;hold&quot; refers to the rock-like shapes on the wall
              that hands and feet can grip.
            </p>
          </div>
          <div>
            <List>
              <ListItem>
                플레이어를 클릭하면 타이머가 작동하고 HP가 줄어들기 시작합니다.
              </ListItem>
              <ListItem>
                TOP 홀드에 두 손을 모으면 완등입니다. (Success)
              </ListItem>
              <ListItem>
                플레이어의 손/발/몸통을 드래그해서 움직일 수 있습니다.
              </ListItem>
              <ListItem>
                하늘색 배경에 있는 모든 물체들은 잡거나 밟을 수 있는 홀드입니다.
              </ListItem>
              <ListItem>
                드래그앤 드롭 시 손발은 홀드 위에만 올릴 수 있습니다.
              </ListItem>
              <ListItem>플레이어는 최대 5분동안 버틸 수 있습니다.</ListItem>
              <ListItem className="warning">
                손/발이 홀드에서 떨어지거나 무게중심이 양 발 사이에 없으면 HP가
                빨리 줄어듭니다.
              </ListItem>
              <ListItem className="warning">
                HP가 0이 되거나 양 손이 홀드에서 떨어지면 추락합니다. (Fail)
              </ListItem>
            </List>
            <p>
              *홀드: 손발로 잡을 수 있는 벽에 붙어있는 돌 형태를 의미합니다.
            </p>
          </div>
        </InstructionText>
      </InstructionContainer>
      <GameStart />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 3rem;
`;

const InstructionContainer = styled.div`
  width: 900px;
  padding: 5px;
  background-color: rgba(200, 200, 200, 0.85);
  border: solid 1px #fff;

  h2 {
    font-size: 1.7rem;
    text-align: center;
  }

  p {
    text-align: right;
  }
`;

const InstructionText = styled.div`
  div {
    margin: 5px;
  }
`;

const List = styled.ul`
  width: 95%;
  padding: 0 35px;
  font-size: 1.5rem;
  white-space: pre-line;
`;

const ListItem = styled.li`
  margin: 10px 0;
  list-style-type: "🪨 ";

  + .warning {
    list-style-type: "⚠️ ";
  }
`;

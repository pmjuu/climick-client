import styled from "styled-components";

const Wrapper = styled.div`
  .table {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    font-size: 1.3rem;

    > div {
      width: 150px;
      border: 1px solid #fff;
    }
  }
`;

export default function Ranking() {
  return (
    <Wrapper>
      <h1>Ranking</h1>
      <div className="table">
        <div>No.</div>
        <div>Name</div>
        <div>Time</div>
        <div>HP</div>
      </div>
    </Wrapper>
  );
}

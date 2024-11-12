import styled from "styled-components";

export default function InvalidPage({ text }) {
  return (
    <Wrapper>
      <div>{text}</div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 2rem;
  text-align: center;
`;

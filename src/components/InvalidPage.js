import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 2rem;
`;

export default function InvalidPage() {
  return (
    <Wrapper>
      <div>Invalid URL</div>
    </Wrapper>
  );
}

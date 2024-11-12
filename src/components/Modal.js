import { useCallback } from "react";
import styled from "styled-components";

export default function Modal({ children, closeModal }) {
  const handleClosingClick = useCallback(
    e => {
      if (e.target === e.currentTarget) {
        document.body.style.cursor = "default";

        return closeModal();
      }
    },
    [closeModal]
  );

  const handleHovering = e => {
    document.body.style.cursor =
      e.target === e.currentTarget ? "pointer" : "default";
  };

  return (
    <ModalWrapper onClick={handleClosingClick} onMouseOver={handleHovering}>
      <ModalDiv>
        <div>{children}</div>
        <CloseButton onClick={closeModal}>X</CloseButton>
      </ModalDiv>
    </ModalWrapper>
  );
}

const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(50, 50, 50, 0.5);
`;

const ModalDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  width: 570px;
  height: 600px;
  background-color: #eee;
  border: 1px solid #fff;
  border-radius: 20px;
  box-shadow: 5px 5px 5px rgba(50, 50, 50, 0.5);
`;

const CloseButton = styled.div`
  margin: 5px;
  padding: 0 10px;
  background-color: transparent;
  border: 2px solid #aaa;
  border-radius: 0.5em;
  color: #aaa;
  font-size: 1.5rem;
  font-weight: 700;
  transition: all 0.3s;

  :hover {
    background-color: #aaa;
    color: #fff;
    cursor: pointer;
  }
`;

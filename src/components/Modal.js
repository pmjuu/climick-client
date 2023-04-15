import styled from "styled-components";
import { useCallback } from "react";

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

  .modal {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
    width: 700px;
    height: 600px;
    background-color: #ccc;
    border: 1px solid #fff;
    border-radius: 20px;
    box-shadow: 5px 5px 5px rgba(50, 50, 50, 0.5);

    .close-button {
      margin: 5px;
      padding: 0 10px;
      background-color: transparent;
      border: 1px solid #fff;
      border-radius: 0.5em;
      color: #fff;
      font-size: 1.5rem;
      font-weight: 700;
      transition: all 0.3s;

      :hover {
        background-color: #fff;
        border: 1px solid #fff;
        color: #aaa;
        cursor: pointer;
      }
    }
  }
`;

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
      <div className="modal">
        <div className="contents">{children}</div>
        <button className="close-button" onClick={closeModal}>
          X
        </button>
      </div>
    </ModalWrapper>
  );
}

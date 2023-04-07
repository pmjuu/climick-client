import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.div`
  position: absolute;
  top: 100px;
  left: 200px;
  width: 700px;
  height: 600px;
  background-color: #aaa;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
`;

export default function Modal({ children, closeModal }) {
  return (
    <Wrapper>
      <button type="button" onClick={closeModal}>
        close
      </button>
      <div>{children}</div>
    </Wrapper>
  );
}

Modal.propTypes = {
  children: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

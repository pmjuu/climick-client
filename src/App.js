import { Route, Routes } from "react-router-dom";
import styled from "styled-components";

import GamePage from "./components/GamePage";
import HomePage from "./components/HomePage";
import Instruction from "./components/Instruction";
import InvalidPage from "./components/InvalidPage";

const EntryWrapper = styled.div`
  width: 100vw;
  height: calc(100vh - 40px);

  footer {
    background-color: rgba(70, 70, 70, 0.5);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: 30px;
    padding: 0 15px;
    height: 40px;
    color: white;

    span {
      height: 20px;
      display: flex;
      align-items: center;
    }

    a {
      color: white;
    }

    .footer-icon {
      margin-top: 1px;
      margin-right: 4px;
      width: 17px;
      height: 17px;
      fill: white;
    }
  }
`;

export default function App() {
  return (
    <EntryWrapper>
      {window.innerWidth < 415 ? (
        <InvalidPage text="not supported in mobile environment" />
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/instruction" element={<Instruction />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/*" element={<InvalidPage text="Invalid URL" />} />
        </Routes>
      )}
      <footer>
        <span>
          <svg
            className="footer-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
          </svg>
          mjuudev@gmail.com
        </span>
        <span>
          <svg
            className="footer-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            height="14px"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <a href="https://www.instagram.com/mjuuclimb/" target="blank">
            @mjuuclimb
          </a>
        </span>
        <span>
          <svg
            className="footer-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
          <a href="https://www.youtube.com/watch?v=w5qo4VSKXTo" target="blank">
            Demo Video
          </a>
        </span>
      </footer>
    </EntryWrapper>
  );
}

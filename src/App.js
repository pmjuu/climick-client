import { Route, Routes } from "react-router-dom";
import styled from "styled-components";

import Game from "./components/Game";
import HomePage from "./components/HomePage";
import Instruction from "./components/Instruction";
import InvalidPage from "./components/InvalidPage";
import Practice from "./components/Practice";

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

    span a {
      height: 20px;
      display: flex;
      align-items: center;
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
          <Route path="/practice" element={<Practice />} />
          <Route path="/game" element={<Game />} />
          <Route path="/*" element={<InvalidPage text="Invalid URL" />} />
        </Routes>
      )}
      <footer>
        <span>
          <a href="mailto:mjuudev@gmail.com" target="blank">
            <svg
              className="footer-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
            </svg>
            mjuudev@gmail.com
          </a>
        </span>
        <span>
          <a href="https://github.com/pmjuu/climick-client" target="blank">
            <svg
              className="footer-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 90 90"
            >
              <path d="M 45 0 C 20.147 0 0 20.467 0 45.714 C 0 67.034 14.367 84.944 33.802 90 c -0.013 -5.283 -0.03 -11.763 -0.04 -13.782 c -12.986 2.869 -15.726 -5.595 -15.726 -5.595 c -2.123 -5.481 -5.183 -6.939 -5.183 -6.939 c -4.236 -2.943 0.319 -2.883 0.319 -2.883 c 4.687 0.334 7.156 4.887 7.156 4.887 c 4.163 7.249 10.92 5.153 13.584 3.942 c 0.419 -3.064 1.628 -5.157 2.964 -6.341 c -10.368 -1.199 -21.268 -5.265 -21.268 -23.435 c 0 -5.177 1.824 -9.407 4.81 -12.728 c -0.485 -1.195 -2.083 -6.018 0.452 -12.55 c 0 0 3.92 -1.274 12.84 4.861 c 3.724 -1.051 7.717 -1.578 11.684 -1.596 c 3.967 0.018 7.963 0.545 11.694 1.596 c 8.91 -6.135 12.824 -4.861 12.824 -4.861 c 2.541 6.532 0.943 11.355 0.458 12.55 c 2.993 3.321 4.804 7.551 4.804 12.728 c 0 18.214 -10.92 22.223 -21.315 23.398 c 1.674 1.472 3.166 4.357 3.166 8.781 c 0 3.513 -0.016 11.601 -0.031 17.74 C 76.021 84.439 90 66.74 90 45.714 C 90 20.467 69.853 0 45 0 z" />
            </svg>
            Github
          </a>
        </span>
        <span>
          <a href="https://www.instagram.com/mjuuclimb" target="blank">
            <svg
              className="footer-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            @mjuuclimb
          </a>
        </span>
        <span>
          <a href="https://www.youtube.com/watch?v=w5qo4VSKXTo" target="blank">
            <svg
              className="footer-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            Demo Video
          </a>
        </span>
      </footer>
    </EntryWrapper>
  );
}

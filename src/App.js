import styled from "styled-components";
import { Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import Instruction from "./components/Instruction";
import GamePage from "./components/GamePage";
import InvalidPage from "./components/InvalidPage";

const EntryWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default function App() {
  return (
    <EntryWrapper>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/instruction" element={<Instruction />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="*" element={<InvalidPage />} />
      </Routes>
    </EntryWrapper>
  );
}

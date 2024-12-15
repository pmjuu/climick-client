import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Footer from "./components/Footer";
import Game from "./components/Game";
import HomePage from "./components/HomePage";
import Instruction from "./components/Instruction";
import InvalidPage from "./components/InvalidPage";
import Practice from "./components/Practice";

export default function App() {
  return (
    <EntryWrapper>
      {window.innerWidth < 415 ? (
        <InvalidPage text="Please visit on a desktop for a smoother experience." />
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/instruction" element={<Instruction />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/game" element={<Game />} />
          <Route path="/*" element={<InvalidPage text="Invalid URL" />} />
        </Routes>
      )}
      <Footer />
    </EntryWrapper>
  );
}

const EntryWrapper = styled.div`
  width: 100vw;
  height: calc(100vh - 90px);
`;

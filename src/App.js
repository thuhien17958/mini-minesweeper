import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./routes/home";
import Game from "./routes/game";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

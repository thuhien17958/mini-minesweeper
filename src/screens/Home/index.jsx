import { useNavigate } from "react-router-dom";
import './home.scss'

export default function Home() {
  let navigate = useNavigate();
  return (
    <div className="main">
      <h1>Welcome to Mini Minesweeper!</h1>
      <div>Please choose level</div>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => navigate("/game?level=beginner")} style={{ marginRight: 10 }}>Beginner</button>
        <button onClick={() => navigate("/game?level=advantage")}>Advantage</button>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import useMatchStore from "../store/matchStore";
import { useNavigate } from "react-router-dom";

const TossPage = () => {
  const { teamA, teamB, setToss } = useMatchStore();
  const navigate = useNavigate();
  const [tossResult, setTossResult] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const flipCoin = () => {
    setIsFlipping(true);
    let flips = 0;
    const interval = setInterval(() => {
      setTossResult(Math.random() < 0.5 ? "Heads" : "Tails");
      flips++;
      if (flips > 10) {
        clearInterval(interval);
        setTossResult(Math.random() < 0.5 ? "Heads" : "Tails");
        setIsFlipping(false);
      }
    }, 100);
  };

  const handleBatChoice = (battingTeam) => {
    const bowlingTeam = battingTeam === teamA ? teamB : teamA;
    setToss(battingTeam, bowlingTeam);
    navigate("/scorer");
  };

  return (
    <div className="flex flex-col justify-center min-h-svh items-center">
      <button
        onClick={flipCoin}
        disabled={isFlipping}
        className="btn btn-primary text-2xl font-bold  w-48 h-48 rounded-full"
      >
        {tossResult ? tossResult : "Toss"}
      </button>

      {tossResult && !isFlipping && (
        <div className="flex flex-col gap-4 mt-8">
          <h2 className="text-2xl ">Who is batting?</h2>

          <button
            className="btn btn-success text-xl"
            onClick={() => handleBatChoice(teamA)}
          >
            {teamA}
          </button>
          <button
            className="btn btn-success text-xl"
            onClick={() => handleBatChoice(teamA)}
          >
            {teamB}
          </button>
        </div>
      )}
    </div>
  );
};

export default TossPage;

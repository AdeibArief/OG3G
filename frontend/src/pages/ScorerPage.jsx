import React, { useEffect, useState } from "react";
import useMatchStore from "../store/matchStore.js";
import { useNavigate } from "react-router-dom";

const ScorerPage = () => {
  const {
    teamA,
    teamB,
    overs,
    playersPerTeam,
    battingFirst,
    bowlingFirst,
    innings,
    currentInnings,
    addBall,
    endInnings,
    undoLastBall,
    resetMatch,
  } = useMatchStore();

  const navigate = useNavigate();
  const [customRun, setCustomRun] = useState("");
  const [noBallPending, setNoBallPending] = useState(false);

  const currentData = innings[currentInnings];
  const battingTeam = currentInnings === 0 ? battingFirst : bowlingFirst;
  const bowlingTeam = currentInnings === 0 ? bowlingFirst : battingFirst;
  const target = currentInnings === 1 ? innings[0].runs + 1 : null;
  const runsNeeded = target ? target - currentData.runs : null;
  const ballsLeft = overs * 6 - currentData.balls;
  const fmtOvers = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;

  // check innings end after every update
  useEffect(() => {
    const allOut = currentData.wickets >= Number(playersPerTeam);
    const oversDown = currentData.balls >= Number(overs) * 6;
    const chased = currentInnings === 1 && currentData.runs >= target;

    if (allOut || oversDown || chased) {
      if (currentInnings === 1) {
        navigate("/result");
      } else {
        endInnings();
        navigate("/innings-break");
      }
    }
  }, [currentData.balls, currentData.wickets, currentData.runs]);

  const handleBall = (label, runs, isWicket, isExtra, isWide) => {
    addBall(label, runs, isWicket, isExtra, isWide);
  };

  const handleReset = () => {
    const confirm = window.confirm("Are you sure you want to reset the match?");
    if (confirm) {
      resetMatch();
      navigate("/setup");
    }
  };

  const handleCustomRun = () => {
    const runs = Number(customRun);
    if (!isNaN(runs) && runs >= 0) {
      if (noBallPending) {
        handleBall(`Nb+${runs}`, runs, false, true, false);
        setNoBallPending(false);
      } else {
        handleBall(String(runs), runs, false, false, false);
      }
      setCustomRun("");
    }
  };

  const handleNoBall = () => {
    setNoBallPending(true);
  };

  const handleQuickRun = (run) => {
    if (noBallPending) {
      handleBall(`Nb+${run}`, run, false, true, false);
      setNoBallPending(false);
    } else {
      handleBall(String(run), run, false, false, false);
    }
  };

  return (
    <div className="flex flex-col min-h-svh bg-base-100">
      {/* ── Scoreboard ── */}
      <div className="bg-base-300 p-5 text-center">
        <div className="flex justify-between items-center mb-2">
          <span className="badge badge-outline text-xs">{teamA}</span>
          <span className="text-xs text-base-content/40">VS</span>
          <span className="badge badge-outline text-xs">{teamB}</span>
        </div>

        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
          {battingTeam} batting
        </p>
        <h1 className="text-6xl font-black tracking-tight">
          {currentData.runs}
          <span className="text-3xl font-bold text-base-content/40">
            /{currentData.wickets}
          </span>
        </h1>
        <p className="text-base-content/50 text-sm mt-1">
          {fmtOvers(currentData.balls)} / {overs} overs
        </p>

        {target && (
          <div className="mt-2 bg-warning/10 rounded-lg p-2">
            <p className="text-warning text-sm font-bold">
              Need {runsNeeded > 0 ? runsNeeded : 0} runs from {ballsLeft} balls
            </p>
          </div>
        )}

        {noBallPending && (
          <div className="mt-2 bg-error/10 rounded-lg p-2">
            <p className="text-error text-sm font-bold">
              No Ball! Select runs scored off the bat
            </p>
          </div>
        )}
      </div>

      {/* ── Current Over Dots ── */}
      <div className="p-4">
        <p className="text-xs text-base-content/40 uppercase tracking-widest mb-2">
          Over {Math.floor(currentData.balls / 6) + 1}
        </p>
        <div className="flex gap-2 flex-wrap min-h-8">
          {currentData.currentOverBalls.length === 0 ? (
            <span className="text-base-content/30 text-sm">No balls yet</span>
          ) : (
            currentData.currentOverBalls.map((ball, i) => (
              <span
                key={i}
                className={`badge badge-lg font-bold ${
                  ball === "W"
                    ? "badge-error"
                    : ball.startsWith("Wd")
                      ? "badge-warning"
                      : ball.startsWith("Nb")
                        ? "badge-info"
                        : ball === "0"
                          ? "badge-ghost"
                          : "badge-success"
                }`}
              >
                {ball}
              </span>
            ))
          )}
        </div>
      </div>

      {currentData.overLog.length > 0 && (
        <div className="p-4 pt-0">
          <p className="text-xs text-base-content/40 uppercase tracking-widest mb-2">
            Over History
          </p>
          <div className="flex flex-col gap-2">
            {[...currentData.overLog].reverse().map((ov, i) => (
              <div key={i} className="flex gap-2 items-center flex-wrap">
                <span className="text-xs text-base-content/40 w-12">
                  Ov {ov.over}
                </span>
                {ov.balls.map((ball, j) => (
                  <span
                    key={j}
                    className={`badge font-bold ${
                      ball === "W"
                        ? "badge-error"
                        : ball.startsWith("Wd")
                          ? "badge-warning"
                          : ball.startsWith("Nb")
                            ? "badge-info"
                            : ball === "0"
                              ? "badge-ghost"
                              : "badge-success"
                    }`}
                  >
                    {ball}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Buttons ── */}
      <div className="mt-auto p-4 flex flex-col gap-3">
        {/* Quick run buttons */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2, 4, 6].map((run) => (
            <button
              key={run}
              className={`btn btn-lg text-2xl font-black ${
                run === 4
                  ? "btn-info"
                  : run === 6
                    ? "btn-warning"
                    : "btn-outline"
              }`}
              onClick={() => handleQuickRun(run)}
            >
              {run}
            </button>
          ))}
          {/* custom run input */}
          <div className="flex gap-1">
            <input
              type="number"
              className="input input-bordered w-full text-center font-bold input-lg "
              placeholder="?"
              value={customRun}
              onChange={(e) => setCustomRun(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {/* confirm custom run */}
        {customRun !== "" && (
          <button className="btn btn-success w-full" onClick={handleCustomRun}>
            Add {customRun} runs
          </button>
        )}

        {/* Wicket + Extras */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="btn btn-error btn-lg font-bold"
            onClick={() => handleBall("W", 0, true, false, false)}
            disabled={noBallPending}
          >
            🏏 Wicket
          </button>
          <button
            className="btn btn-outline btn-lg w-full"
            onClick={undoLastBall}
          >
            ↩ Undo
          </button>
          <button
            className="btn btn-error btn-lg btn-outline"
            onClick={handleReset}
          >
            Reset Match
          </button>

          <details className="dropdown dropdown-top w-full">
            <summary className="btn btn-outline btn-lg w-full">
              Extras ▲
            </summary>
            <ul className="dropdown-content menu bg-base-200 rounded-box z-10 w-full p-2 shadow mb-2">
              <li>
                <a onClick={() => handleBall("Wd", 0, false, true, true)}>
                  Wide
                </a>
              </li>
              <li>
                <a onClick={handleNoBall}>No Ball</a>
              </li>
              <li>
                <a onClick={() => handleBall("B", 1, false, false, false)}>
                  Bye (+1)
                </a>
              </li>
              <li>
                <a onClick={() => handleBall("Lb", 1, false, false, false)}>
                  Leg Bye (+1)
                </a>
              </li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
};

export default ScorerPage;

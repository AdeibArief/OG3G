import React from "react";
import useMatchStore from "../store/matchStore.js";
import { useNavigate } from "react-router-dom";

const InningsBreak = () => {
  const { innings, battingFirst, bowlingFirst, overs } = useMatchStore();
  const navigate = useNavigate();
  const inn1 = innings[0];
  const target = inn1.runs + 1;
  const fmtOvers = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;

  return (
    <div className="flex flex-col min-h-svh items-center justify-center p-6 bg-base-100">
      <div className="card bg-base-300 w-full max-w-md">
        <div className="card-body text-center gap-4">

          <h2 className="text-xl font-bold text-primary uppercase tracking-widest">
            Innings Break
          </h2>

          {/* Innings 1 summary */}
          <div className="bg-base-200 rounded-xl p-4">
            <p className="text-xs text-base-content/40 uppercase tracking-widest mb-1">
              {battingFirst} scored
            </p>
            <h1 className="text-5xl font-black">
              {inn1.runs}
              <span className="text-2xl font-bold text-base-content/40">
                /{inn1.wickets}
              </span>
            </h1>
            <p className="text-base-content/50 text-sm mt-1">
              in {fmtOvers(inn1.balls)} / {overs} overs
            </p>
          </div>

          {/* Target */}
          <div className="bg-warning/10 rounded-xl p-4">
            <p className="text-xs text-warning uppercase tracking-widest mb-1">
              Target
            </p>
            <h2 className="text-4xl font-black text-warning">{target}</h2>
            <p className="text-sm text-base-content/50 mt-1">
              {bowlingFirst} needs {target} runs in {overs} overs
            </p>
          </div>

          <button
            className="btn btn-primary btn-lg w-full mt-2"
            onClick={() => navigate("/scorer")}
          >
            Start Innings 2 🏏
          </button>

        </div>
      </div>
    </div>
  );
};

export default InningsBreak;
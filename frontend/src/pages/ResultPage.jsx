import React from "react";
import useMatchStore from "../store/matchStore.js";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api.js";

const ResultPage = () => {
  const {
    innings, battingFirst, bowlingFirst,
    teamA, teamB, overs, playersPerTeam,
    resetMatch
  } = useMatchStore();
  const navigate = useNavigate();
  const [saving, setSaving] = React.useState(false);

  const inn1 = innings[0];
  const inn2 = innings[1];
  const target = inn1.runs + 1;
  const fmtOvers = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;

  // calculate result string
  const getResult = () => {
    if (inn2.runs >= target) {
      const wicketsLeft = Number(playersPerTeam) - inn2.wickets;
      return `${bowlingFirst} won by ${wicketsLeft} wicket${wicketsLeft !== 1 ? "s" : ""}`;
    } else if (inn2.runs === inn1.runs) {
      return "Match Tied!";
    } else {
      const diff = inn1.runs - inn2.runs;
      return `${battingFirst} won by ${diff} run${diff !== 1 ? "s" : ""}`;
    }
  };

  const result = getResult();

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post("/api/matches/saveMatch", {
        teamA,
        teamB,
        overs,
        playersPerTeam,
        innings: [
          {
            battingTeam: battingFirst,
            runs: inn1.runs,
            wickets: inn1.wickets,
            balls: inn1.balls,
            overLog: inn1.overLog,
          },
          {
            battingTeam: bowlingFirst,
            runs: inn2.runs,
            wickets: inn2.wickets,
            balls: inn2.balls,
            overLog: inn2.overLog,
          },
        ],
        result,
      });
      resetMatch();
      navigate("/history");
    } catch (err) {
      console.error("Failed to save match", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    resetMatch();
    navigate("/setup");
  };

  return (
    <div className="flex flex-col min-h-svh items-center justify-center p-6 bg-base-100">
      <div className="card bg-base-300 w-full max-w-md">
        <div className="card-body text-center gap-4">

          <div className="text-5xl">🏆</div>
          <h2 className="text-xl font-black text-primary">{result}</h2>

          {/* Scorecard */}
          <div className="bg-base-200 rounded-xl p-4 text-left">
            <p className="text-xs text-base-content/40 uppercase tracking-widest mb-3">
              Scorecard
            </p>

            {/* Team 1 */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">{battingFirst}</span>
              <span className="text-lg font-black">
                {inn1.runs}/{inn1.wickets}
                <span className="text-xs text-base-content/40 ml-1">
                  ({fmtOvers(inn1.balls)} ov)
                </span>
              </span>
            </div>

            <div className="divider my-1"></div>

            {/* Team 2 */}
            <div className="flex justify-between items-center">
              <span className="font-bold">{bowlingFirst}</span>
              <span className="text-lg font-black">
                {inn2.runs}/{inn2.wickets}
                <span className="text-xs text-base-content/40 ml-1">
                  ({fmtOvers(inn2.balls)} ov)
                </span>
              </span>
            </div>
          </div>

          {/* Buttons */}
          <button
            className="btn btn-primary btn-lg w-full"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <span className="loading loading-spinner"></span> : "Save to History"}
          </button>

          <button
            className="btn btn-outline w-full"
            onClick={handleDiscard}
          >
            Discard & New Match
          </button>

        </div>
      </div>
    </div>
  );
};

export default ResultPage;
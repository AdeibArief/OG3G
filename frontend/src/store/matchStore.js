import { create } from "zustand";
import { persist } from "zustand/middleware";
const useMatchStore = create(
  persist(
    (set, get) => ({
      // Match Setup
      teamA: "",
      teamB: "",
      overs: null,
      playersPerTeam: null,
      battingFirst: null,
      bowlingFirst: null,
      matchStatus: "setup",
      inningsHistory: [],
      // Innings Setup

      currentInnings: 0,
      innings: [
        {
          battingTeam: null,
          runs: 0,
          wickets: 0,
          balls: 0,
          overLog: [],
          currentOverBalls: [],
          widesThisOver: 0,
        },
        {
          battingTeam: null,
          runs: 0,
          wickets: 0,
          balls: 0,
          overLog: [],
          currentOverBalls: [],
          widesThisOver: 0,
        },
      ],

      // Actions

      setSetup: (teamA, teamB, overs, playersPerTeam) =>
        set({ teamA, teamB, overs, playersPerTeam, matchStatus: "toss" }),
      setToss: (battingFirst, bowlingFirst) =>
        set({ battingFirst, bowlingFirst, matchStatus: "innings1" }),

      addBall: (ballLabel, runsScored, isWicket, isExtra, isWide) => {
        const state = get();
        // at the start of addBall
        set({
          inningsHistory: [
            ...state.inningsHistory,
            JSON.parse(JSON.stringify(state.innings)),
          ],
        });

        const idx = state.currentInnings;
        const innings = [...state.innings];
        const current = { ...innings[idx] };

        if (isWide) {
          const newWides = current.widesThisOver + 1;
          const wideRuns = newWides % 2 === 0 ? 1 : 0;
          current.runs += wideRuns;
          current.widesThisOver = newWides;
        } else {
          current.runs += runsScored;
          if (isWicket) current.wickets += 1;
          if (!isExtra) current.balls += 1;
        }

        const updatedOverBalls = [...current.currentOverBalls, ballLabel];

        // close over when 6 legal balls bowled
        if (
          !isWide &&
          !isExtra &&
          current.balls % 6 === 0 &&
          current.balls > 0
        ) {
          current.overLog = [
            ...current.overLog,
            { over: Math.floor(current.balls / 6), balls: updatedOverBalls },
          ];
          current.currentOverBalls = [];
          current.widesThisOver = 0; // 👈 reset only here
        } else {
          current.currentOverBalls = updatedOverBalls;
        }

        innings[idx] = current;
        set({ innings });
      },
      undoLastBall: () => {
        const { inningsHistory } = get();
        if (inningsHistory.length === 0) return;

        const previous = inningsHistory[inningsHistory.length - 1];
        const newHistory = inningsHistory.slice(0, -1);

        set({ innings: previous, inningsHistory: newHistory });
      },
      endInnings: () => {
        const state = get();
        if (state.currentInnings === 0) {
          set({ currentInnings: 1, matchStatus: "innings2" });
        } else {
          set({ matchStatus: "completed" });
        }
      },

      resetMatch: () => {
        localStorage.removeItem("match-storage");
        set({
          teamA: "",
          teamB: "",
          overs: null,
          playersPerTeam: null,
          battingFirst: null,
          bowlingFirst: null,
          matchStatus: "setup",
          currentInnings: 0,
          inningsHistory: [],
          innings: [
            {
              battingTeam: null,
              runs: 0,
              wickets: 0,
              balls: 0,
              overLog: [],
              currentOverBalls: [],
              widesThisOver: 0,
            },
            {
              battingTeam: null,
              runs: 0,
              wickets: 0,
              balls: 0,
              overLog: [],
              currentOverBalls: [],
              widesThisOver: 0,
            },
          ],
        });
      },
    }),
    { name: "match-storage" },
  ),
);

export default useMatchStore;

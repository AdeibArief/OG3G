import React, { useEffect, useState } from "react";
import { api } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

const HistoryPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get("/api/matches/getAllMatches");
        setMatches(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const fmtDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-svh bg-base-100">

      {/* Header */}
      <div className="bg-base-300 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black">Match History</h1>
          <p className="text-xs text-base-content/40">@{user?.userName}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/setup")}
          >
            New Match
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {loading ? (
          <div className="flex justify-center mt-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-4xl mb-3">🏏</p>
            <p className="font-bold text-lg">No matches yet</p>
            <p className="text-base-content/40 text-sm mb-4">
              Start scoring your first match!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/setup")}
            >
              Start Match
            </button>
          </div>
        ) : (
          matches.map((match) => (
            <div key={match._id} className="card bg-base-300">
              <div className="card-body p-4 gap-2">

                {/* Teams */}
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-black text-lg">{match.teamA}</span>
                    <span className="text-sm text-base-content/50">
                      {match.innings[0]?.runs}/{match.innings[0]?.wickets}
                      <span className="text-xs ml-1">
                        ({Math.floor(match.innings[0]?.balls / 6)}.
                        {match.innings[0]?.balls % 6} ov)
                      </span>
                    </span>
                  </div>

                  <span className="badge badge-outline text-xs">VS</span>

                  <div className="flex flex-col text-right">
                    <span className="font-black text-lg">{match.teamB}</span>
                    <span className="text-sm text-base-content/50">
                      {match.innings[1]?.runs}/{match.innings[1]?.wickets}
                      <span className="text-xs ml-1">
                        ({Math.floor(match.innings[1]?.balls / 6)}.
                        {match.innings[1]?.balls % 6} ov)
                      </span>
                    </span>
                  </div>
                </div>

                <div className="divider my-0"></div>

                {/* Result + Date */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-primary">
                    {match.result}
                  </span>
                  <span className="text-xs text-base-content/40">
                    {fmtDate(match.date)}
                  </span>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
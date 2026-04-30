import React, { useState } from "react";
import useMatchStore from "../store/matchStore";
import { useNavigate } from "react-router-dom";

const SetupPage = () => {
  const { setSetup } = useMatchStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    TeamA: "",
    TeamB: "",
    TotalOvers: "",
    PlayersPerTeam: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    await setSetup(
      formData.TeamA,
      formData.TeamB,
      formData.TotalOvers,
      formData.PlayersPerTeam,
    );

    navigate("/toss");
  };

  return (
    <div className="flex flex-col min-h-screen justify-center text-center items-center">
      <div className="card bg-base-200 card-bordered card-normal w-fit p-10 gap-">
        <div className="card-body flex flex-col gap-10">
          <h1 className="card-title font-bold text-center justify-center text-3xl">
            Setup
          </h1>

          <form
            className=" form form-control gap-4 flex flex-col "
          >
            <input
              type="text"
              name="TeamA"
              value={formData.TeamA}
              onChange={handleChange}
              required
              className="input input-bordered text-center"
              placeholder="Team A"
            />
            <input
              type="text"
              name="TeamB"
              value={formData.TeamB}
              onChange={handleChange}
              required
              className="input input-bordered text-center"
              placeholder="Team B"
            />

            <input
              type="number"
              name="TotalOvers"
              value={formData.TotalOvers}
              onChange={handleChange}
              required
              className="input input-bordered text-center"
              placeholder="Total Overs"
            />
            <input
              type="number"
              name="PlayersPerTeam"
              value={formData.PlayersPerTeam}
              onChange={handleChange}
              required
              className="input input-bordered text-center"
              placeholder="Players per team"
            />
          </form>

          <button className="btn btn-error" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default SetupPage;

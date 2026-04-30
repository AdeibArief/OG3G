import mongoose from "mongoose";

const ballSchema = new mongoose.Schema({
  over: { type: Number, required: true },
  balls: [{ type: String }],
});

const inningSchema = new mongoose.Schema({
  battingTeam: { type: String, required: true },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  ball: { type: Number, default: 0 },
  overLog: [ballSchema],
});

const matchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamA: { type: String, required: true },
    teamB: { type: String, required: true },
    overs: { type: Number, required: true },
    playersPerTeam: { type: Number, required: true },
    innings: [inningSchema],
    result: { type: String },
    date: { type: Date, default: Date.now() },
  },
  { timeStamps: true },
);


export default mongoose.model('Match',matchSchema)
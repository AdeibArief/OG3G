import Match from "../models/Match.js";

export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find({ user: req.user._id });

    res.status(200).json({ success: true, data: matches });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getaMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (match.user.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ success: true, message: "Not Authorized Who are you?" });
    }
    if (!match) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot retrieve data" });
    }
    res.status(200).json({ success: true, message: match });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const saveMatch = async (req, res) => {
  const { teamA, teamB, overs, playersPerTeam, innings, result } = req.body;

  try {
    if (!teamA || !teamB || !overs || !playersPerTeam || !innings || !result) {
      return res
        .status(404)
        .json({ success: false, message: "Fill all the details" });
    }
    const match = await Match.create({
      user: req.user._id,
      teamA,
      teamB,
      overs,
      playersPerTeam,
      innings,
      result,
    });

    res.status(200).json({ success: true, data: match });
  } catch (error) {
    res.status(404).json({ success: false, data: error.message });
  }
};

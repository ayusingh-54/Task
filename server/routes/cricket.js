const express = require("express");
const router = express.Router();
const cricketApiService = require("../services/cricketApiService");

// Get list of cricket matches
router.get("/matches", async (req, res) => {
  try {
    const matches = await cricketApiService.getMatches();
    res.json(matches);
  } catch (error) {
    console.error("Error fetching cricket matches:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch cricket matches",
        error: error.message,
      });
  }
});

// Get cricket match info by ID
router.get("/matches/:id", async (req, res) => {
  try {
    const matchId = req.params.id;
    const match = await cricketApiService.getMatchInfo(matchId);
    res.json(match);
  } catch (error) {
    console.error(
      `Error fetching cricket match with ID ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({
        message: "Failed to fetch cricket match details",
        error: error.message,
      });
  }
});

// Get cricket match scorecard
router.get("/matches/:id/scorecard", async (req, res) => {
  try {
    const matchId = req.params.id;
    const scorecard = await cricketApiService.getMatchScorecard(matchId);
    res.json(scorecard);
  } catch (error) {
    console.error(
      `Error fetching cricket scorecard for match ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({
        message: "Failed to fetch cricket scorecard",
        error: error.message,
      });
  }
});

// Get cricket match commentary
router.get("/matches/:id/commentary", async (req, res) => {
  try {
    const matchId = req.params.id;
    const commentary = await cricketApiService.getMatchCommentary(matchId);
    res.json(commentary);
  } catch (error) {
    console.error(
      `Error fetching cricket commentary for match ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({
        message: "Failed to fetch cricket commentary",
        error: error.message,
      });
  }
});

// Get series list
router.get("/series", async (req, res) => {
  try {
    const series = await cricketApiService.getSeriesList();
    res.json(series);
  } catch (error) {
    console.error("Error fetching cricket series:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch cricket series",
        error: error.message,
      });
  }
});

// Get news list
router.get("/news", async (req, res) => {
  try {
    const news = await cricketApiService.getNewsList();
    res.json(news);
  } catch (error) {
    console.error("Error fetching cricket news:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch cricket news", error: error.message });
  }
});

// Get list of IPL cricket matches
router.get("/matches/ipl", async (req, res) => {
  try {
    const matches = await cricketApiService.getIplMatches();
    res.json(matches);
  } catch (error) {
    console.error("Error fetching IPL cricket matches:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch IPL cricket matches",
        error: error.message,
      });
  }
});

// Get previous matches
router.get("/matches/previous", async (req, res) => {
  try {
    const previousMatches = await cricketApiService.getPreviousMatches();
    res.json(previousMatches);
  } catch (error) {
    console.error("Error fetching previous cricket matches:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch previous cricket matches",
        error: error.message,
      });
  }
});

module.exports = router;

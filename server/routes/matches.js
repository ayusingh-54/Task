const express = require("express");
const router = express.Router();
const apiService = require("../services/apiService");

// Middleware to determine sport type from query param
const withSportType = (req, res, next) => {
  // Get the sport type from query param, defaulting to what's in .env
  if (req.query.sportType) {
    // Temporarily override the SPORT_TYPE for this request
    req.sportType = req.query.sportType;
  } else {
    req.sportType = process.env.SPORT_TYPE || "football";
  }
  next();
};

// Apply the sport type middleware to all routes
router.use(withSportType);

// Get all upcoming matches (existing, might be for a default competition)
router.get("/", async (req, res) => {
  try {
    // Pass sport type to the service
    const matches = await apiService.getUpcomingMatches(req.sportType);
    res.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch matches", error: error.message });
  }
});

// Get match by ID
router.get("/:id", async (req, res) => {
  try {
    const matchId = req.params.id;
    const match = await apiService.getMatchById(matchId, req.sportType);
    res.json(match);
  } catch (error) {
    console.error(`Error fetching match with ID ${req.params.id}:`, error);
    res
      .status(500)
      .json({ message: "Failed to fetch match details", error: error.message });
  }
});

// Get head-to-head statistics
router.get("/head-to-head/:team1Id/:team2Id", async (req, res) => {
  try {
    const { team1Id, team2Id } = req.params;
    const headToHead = await apiService.getHeadToHead(
      team1Id,
      team2Id,
      req.sportType
    );
    res.json(headToHead);
  } catch (error) {
    console.error(
      `Error fetching head-to-head for teams ${req.params.team1Id} and ${req.params.team2Id}:`,
      error
    );
    res.status(500).json({
      message: "Failed to fetch head-to-head statistics",
      error: error.message,
    });
  }
});

// NEW V4 ROUTES

// Get today's matches
router.get("/today/all", async (req, res) => {
  try {
    const matches = await apiService.getTodaysMatches(req.sportType);
    res.json(matches);
  } catch (error) {
    console.error("Error fetching today's matches:", error);
    res.status(500).json({
      message: "Failed to fetch today's matches",
      error: error.message,
    });
  }
});

// Get all matches for a specific competition
router.get("/competitions/:competitionCode/all", async (req, res) => {
  try {
    const { competitionCode } = req.params;
    const { season } = req.query; // Expect season for basketball, e.g., /api/matches/competitions/12/all?season=2023-2024
    const matches = await apiService.getCompetitionMatches(
      competitionCode.toUpperCase(), // For football, this is code like PL, for basketball, it's league ID like 12
      season,
      req.sportType
    );
    res.json(matches);
  } catch (error) {
    console.error(
      `Error fetching matches for competition ${req.params.competitionCode}:`,
      error
    );
    res.status(500).json({
      message: "Failed to fetch competition matches",
      error: error.message,
    });
  }
});

// Get league table for a competition
router.get("/competitions/:competitionCode/standings", async (req, res) => {
  try {
    const { competitionCode } = req.params;
    const { season } = req.query; // Expect season for basketball
    const standings = await apiService.getCompetitionStandings(
      competitionCode.toUpperCase(), // For football, this is code like PL, for basketball, it's league ID like 12
      season,
      req.sportType
    );
    res.json(standings);
  } catch (error) {
    console.error(
      `Error fetching standings for competition ${req.params.competitionCode}:`,
      error
    );
    res.status(500).json({
      message: "Failed to fetch competition standings",
      error: error.message,
    });
  }
});

// Get scorers for a competition
router.get("/competitions/:competitionCode/scorers", async (req, res) => {
  try {
    const { competitionCode } = req.params;
    const { season } = req.query; // Expect season for basketball
    const scorers = await apiService.getCompetitionScorers(
      competitionCode.toUpperCase(), // For football, this is code like PL, for basketball, it's league ID like 12
      season,
      req.sportType
    );
    res.json(scorers);
  } catch (error) {
    console.error(
      `Error fetching scorers for competition ${req.params.competitionCode}:`,
      error
    );
    res.status(500).json({
      message: "Failed to fetch competition scorers",
      error: error.message,
    });
  }
});

// Get previous matches (FINISHED status)
router.get("/previous", async (req, res) => {
  try {
    const matches = await apiService.getPreviousMatches(req.sportType);
    res.json(matches);
  } catch (error) {
    console.error("Error fetching previous matches:", error);
    res.status(500).json({
      message: "Failed to fetch previous matches",
      error: error.message,
    });
  }
});

module.exports = router;

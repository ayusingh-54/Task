const express = require("express");
const router = express.Router();
const apiService = require("../services/apiService");

// Get team by ID
router.get("/:id", async (req, res) => {
  try {
    const teamId = req.params.id;
    const team = await apiService.getTeamById(teamId);
    res.json(team);
  } catch (error) {
    console.error(`Error fetching team with ID ${req.params.id}:`, error);
    res
      .status(500)
      .json({ message: "Failed to fetch team details", error: error.message });
  }
});

module.exports = router;

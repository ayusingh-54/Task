import axios from "axios";
import { addSportParam, SPORTS } from "./apiHelper";

const API_URL = "/api";

const matchesService = {
  // Get all upcoming matches with sport type
  getUpcomingMatches: async (sport = SPORTS.FOOTBALL) => {
    try {
      const endpoint = addSportParam(`${API_URL}/matches`, sport);
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching upcoming ${sport} matches:`, error);
      throw error;
    }
  },

  // Get match details by ID
  getMatchById: async (matchId, sport = SPORTS.FOOTBALL) => {
    try {
      const endpoint = addSportParam(`${API_URL}/matches/${matchId}`, sport);
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${sport} match with ID ${matchId}:`, error);
      throw error;
    }
  },

  // Get head-to-head statistics
  getHeadToHead: async (team1Id, team2Id, sport = SPORTS.FOOTBALL) => {
    try {
      const endpoint = addSportParam(
        `${API_URL}/matches/head-to-head/${team1Id}/${team2Id}`,
        sport
      );
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching head-to-head for ${sport} teams ${team1Id} and ${team2Id}:`,
        error
      );
      throw error;
    }
  },

  // Get team details by ID
  getTeamById: async (teamId, sport = SPORTS.FOOTBALL) => {
    try {
      const endpoint = addSportParam(`${API_URL}/teams/${teamId}`, sport);
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${sport} team with ID ${teamId}:`, error);
      throw error;
    }
  },

  // NEW V4 Service Methods
  getTodaysMatches: async (sport = SPORTS.FOOTBALL) => {
    try {
      const endpoint = addSportParam(`${API_URL}/matches/today/all`, sport);
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching today's ${sport} matches:`, error);
      throw error;
    }
  },

  getCompetitionMatches: async (
    competitionCode,
    season,
    sport = SPORTS.FOOTBALL
  ) => {
    try {
      let endpoint = `${API_URL}/matches/competitions/${competitionCode}/all`;
      if (season) {
        endpoint += `?season=${season}`;
      }
      endpoint = addSportParam(endpoint, sport);

      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching ${sport} matches for competition ${competitionCode}:`,
        error
      );
      throw error;
    }
  },

  getCompetitionStandings: async (
    competitionCode,
    season,
    sport = SPORTS.FOOTBALL
  ) => {
    try {
      let endpoint = `${API_URL}/matches/competitions/${competitionCode}/standings`;
      if (season) {
        endpoint += `?season=${season}`;
      }
      endpoint = addSportParam(endpoint, sport);

      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching ${sport} standings for competition ${competitionCode}:`,
        error
      );
      throw error;
    }
  },

  getCompetitionScorers: async (
    competitionCode,
    season,
    sport = SPORTS.FOOTBALL
  ) => {
    try {
      let endpoint = `${API_URL}/matches/competitions/${competitionCode}/scorers`;
      if (season) {
        endpoint += `?season=${season}`;
      }
      endpoint = addSportParam(endpoint, sport);

      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching ${sport} scorers for competition ${competitionCode}:`,
        error
      );
      throw error;
    }
  },

  // Get previous matches
  getPreviousMatches: async (sport = SPORTS.FOOTBALL) => {
    try {
      const endpoint = addSportParam(`${API_URL}/matches/previous`, sport);
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching previous ${sport} matches:`, error);
      throw error;
    }
  },
};

export default matchesService;

import axios from "axios";

const API_URL = "/api/cricket";

const cricketService = {
  // Get all upcoming cricket matches
  getMatches: async () => {
    try {
      const response = await axios.get(`${API_URL}/matches/list`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cricket matches:", error);
      throw error;
    }
  },

  // Get previous cricket matches
  getPreviousMatches: async () => {
    try {
      const response = await axios.get(`${API_URL}/matches/previous`);
      return response.data;
    } catch (error) {
      console.error("Error fetching previous cricket matches:", error);
      throw error;
    }
  },

  // Get match overs
  getMatchOvers: async (matchId) => {
    try {
      const response = await axios.get(
        `${API_URL}/matches/get-overs?matchId=${matchId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching overs for cricket match ${matchId}:`,
        error
      );
      throw error;
    }
  },

  // Get cricket match details by ID
  getMatchById: async (matchId) => {
    try {
      const response = await axios.get(`${API_URL}/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cricket match with ID ${matchId}:`, error);
      throw error;
    }
  },

  // Get cricket match scorecard
  getMatchScorecard: async (matchId) => {
    try {
      const response = await axios.get(
        `${API_URL}/matches/${matchId}/scorecard`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching cricket scorecard for match ${matchId}:`,
        error
      );
      throw error;
    }
  },

  // Get cricket match commentary
  getMatchCommentary: async (matchId) => {
    try {
      const response = await axios.get(
        `${API_URL}/matches/${matchId}/commentary`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching cricket commentary for match ${matchId}:`,
        error
      );
      throw error;
    }
  },

  // Get cricket series list
  getSeriesList: async () => {
    try {
      const response = await axios.get(`${API_URL}/series`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cricket series:", error);
      throw error;
    }
  },

  // Get cricket news
  getNewsList: async () => {
    try {
      const response = await axios.get(`${API_URL}/news`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cricket news:", error);
      throw error;
    }
  },

  // Get IPL cricket matches
  getIplMatches: async () => {
    try {
      const response = await axios.get(`${API_URL}/matches/ipl`);
      return response.data;
    } catch (error) {
      console.error("Error fetching IPL cricket matches:", error);
      throw error;
    }
  },
};

export default cricketService;

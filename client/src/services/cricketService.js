import axios from "axios";
import config from "../config";

// Use config for API URL
const API_URL = config.api.useProxy
  ? "/api/cricket"
  : `${config.api.baseUrl}/api/cricket`;

// Create an axios instance with proper configuration
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
    // Add CORS headers on client side as a fallback
    "Access-Control-Allow-Origin": "*",
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (config.features.enableErrorLogging) {
      console.error("Cricket API Error:", error.message);

      // Add debugging information
      if (error.config) {
        console.debug(
          `Failed cricket request to: ${
            error.config.method?.toUpperCase() || "GET"
          } ${error.config.url}`
        );
      }
    }

    return Promise.reject(error);
  }
);

const cricketService = {
  // Get all upcoming cricket matches
  getMatches: async () => {
    try {
      const response = await apiClient.get(`matches/list`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cricket matches:", error);
      throw error;
    }
  },

  // Get previous cricket matches
  getPreviousMatches: async () => {
    try {
      const response = await apiClient.get(`matches/previous`);
      return response.data;
    } catch (error) {
      console.error("Error fetching previous cricket matches:", error);
      throw error;
    }
  },

  // Get match overs
  getMatchOvers: async (matchId) => {
    try {
      const response = await apiClient.get(
        `matches/get-overs?matchId=${matchId}`
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
      const response = await apiClient.get(`matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cricket match with ID ${matchId}:`, error);
      throw error;
    }
  },

  // Get cricket match scorecard
  getMatchScorecard: async (matchId) => {
    try {
      const response = await apiClient.get(`matches/${matchId}/scorecard`);
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
      const response = await apiClient.get(`matches/${matchId}/commentary`);
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
      const response = await apiClient.get(`series`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cricket series:", error);
      throw error;
    }
  },

  // Get cricket news
  getNewsList: async () => {
    try {
      const response = await apiClient.get(`news`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cricket news:", error);
      throw error;
    }
  },

  // Get IPL cricket matches
  getIplMatches: async () => {
    try {
      const response = await apiClient.get(`matches/ipl`);
      return response.data;
    } catch (error) {
      console.error("Error fetching IPL cricket matches:", error);
      throw error;
    }
  },
};

export default cricketService;

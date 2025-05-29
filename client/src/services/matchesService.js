import axios from "axios";
import { addSportParam, SPORTS } from "./apiHelper";
import config from "../config";
import todaysMatchesMock from "../mocks/todaysMatches";

// Use config for API URL
const API_URL = config.api.useProxy ? "/api" : `${config.api.baseUrl}/api`;

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
      console.error("API Error:", error.message);

      // Add debugging information
      if (error.config) {
        console.debug(
          `Failed request to: ${error.config.method?.toUpperCase() || "GET"} ${
            error.config.url
          }`
        );
      }
    }

    // Continue throwing the error for the service to handle
    return Promise.reject(error);
  }
);

const matchesService = {
  // Get all upcoming matches with sport type
  getUpcomingMatches: async (sport = SPORTS.FOOTBALL) => {
    try {
      const endpoint = addSportParam(`matches`, sport);
      const response = await apiClient.get(endpoint);
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
      // Try the API call first if not configured to always use mock data
      if (!config.features.alwaysUseMockData) {
        const endpoint = addSportParam(`matches/today/all`, sport);
        const response = await apiClient.get(endpoint);
        return response.data;
      } else {
        // Only log when explicitly configured to use mock data
        if (config.dev.debug) {
          console.log(
            `Using mock data for today's ${sport} matches (configured in settings)`
          );
        }

        if (sport === SPORTS.BASKETBALL) {
          return todaysMatchesMock.getBasketballMatches();
        } else {
          return todaysMatchesMock.getFootballMatches();
        }
      }
    } catch (error) {
      if (config.features.enableErrorLogging) {
        console.error(`Error fetching today's ${sport} matches:`, error);
        console.log(`Falling back to mock data for today's ${sport} matches`);
      }

      // Fallback to mock data on error
      if (sport === SPORTS.BASKETBALL) {
        return todaysMatchesMock.getBasketballMatches();
      } else {
        return todaysMatchesMock.getFootballMatches();
      }
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
    // Only log when debugging is enabled
    if (config.dev.debug) {
      console.log(
        `Attempting to fetch ${sport} standings for ${competitionCode}...`
      );
    }

    try {
      // Try the API call but expect it to fail due to CORS
      let endpoint = `matches/competitions/${competitionCode}/standings`;
      const params = {};

      if (season) {
        params.season = season;
      }

      if (sport !== SPORTS.FOOTBALL) {
        params.sportType = sport;
      }

      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      if (config.features.enableErrorLogging) {
        console.log(
          `API call failed as expected due to CORS. Using fallback data for ${sport} ${competitionCode}`
        );
      }

      // Return mock data based on sport and competition
      if (sport === SPORTS.BASKETBALL && competitionCode === "12") {
        return {
          response: [
            {
              league: {
                id: 12,
                name: "NBA",
                logo: "https://media.api-sports.io/basketball/leagues/12.png",
                season: season || "2023-2024",
                standings: [
                  [
                    {
                      team: {
                        id: 1,
                        name: "Boston Celtics",
                        logo: "https://media.api-sports.io/basketball/teams/1.png",
                      },
                      position: 1,
                      games: {
                        played: 20,
                        win: { total: 16, percentage: ".800" },
                        lose: { total: 4, percentage: ".200" },
                      },
                      group: { name: "Eastern Conference" },
                    },
                    {
                      team: {
                        id: 5,
                        name: "Miami Heat",
                        logo: "https://media.api-sports.io/basketball/teams/5.png",
                      },
                      position: 2,
                      games: {
                        played: 20,
                        win: { total: 14, percentage: ".700" },
                        lose: { total: 6, percentage: ".300" },
                      },
                      group: { name: "Eastern Conference" },
                    },
                  ],
                  [
                    {
                      team: {
                        id: 9,
                        name: "Los Angeles Lakers",
                        logo: "https://media.api-sports.io/basketball/teams/9.png",
                      },
                      position: 1,
                      games: {
                        played: 20,
                        win: { total: 15, percentage: ".750" },
                        lose: { total: 5, percentage: ".250" },
                      },
                      group: { name: "Western Conference" },
                    },
                    {
                      team: {
                        id: 11,
                        name: "Golden State Warriors",
                        logo: "https://media.api-sports.io/basketball/teams/11.png",
                      },
                      position: 2,
                      games: {
                        played: 20,
                        win: { total: 13, percentage: ".650" },
                        lose: { total: 7, percentage: ".350" },
                      },
                      group: { name: "Western Conference" },
                    },
                  ],
                ],
              },
            },
          ],
        };
      } else if (sport === SPORTS.FOOTBALL && competitionCode === "PL") {
        return {
          competition: {
            name: "Premier League",
            code: "PL",
            emblem: "https://crests.football-data.org/PL.png",
          },
          standings: [
            {
              table: [
                {
                  position: 1,
                  team: {
                    id: 64,
                    name: "Liverpool FC",
                    crest: "https://crests.football-data.org/64.png",
                  },
                  playedGames: 15,
                  won: 12,
                  draw: 2,
                  lost: 1,
                  points: 38,
                  goalsFor: 35,
                  goalsAgainst: 12,
                  goalDifference: 23,
                },
                {
                  position: 2,
                  team: {
                    id: 65,
                    name: "Manchester City FC",
                    crest: "https://crests.football-data.org/65.png",
                  },
                  playedGames: 15,
                  won: 11,
                  draw: 3,
                  lost: 1,
                  points: 36,
                  goalsFor: 33,
                  goalsAgainst: 10,
                  goalDifference: 23,
                },
                {
                  position: 3,
                  team: {
                    id: 66,
                    name: "Manchester United FC",
                    crest: "https://crests.football-data.org/66.png",
                  },
                  playedGames: 15,
                  won: 10,
                  draw: 3,
                  lost: 2,
                  points: 33,
                  goalsFor: 28,
                  goalsAgainst: 15,
                  goalDifference: 13,
                },
              ],
            },
          ],
        };
      }

      // If no specific mock data available, throw the original error
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

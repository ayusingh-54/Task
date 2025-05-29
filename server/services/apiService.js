const axios = require("axios");
require("dotenv").config();

// API configuration
const FOOTBALL_API_URL = "https://api.football-data.org/v4"; // Updated to v4
const BASKETBALL_API_URL = "https://v1.basketball.api-sports.io"; // Updated to api-basketball.com

// Choose which API to use (can be made configurable)
const SPORT_TYPE = process.env.SPORT_TYPE || "football"; // 'football' or 'basketball'

// API headers
const footballHeaders = {
  "X-Auth-Token": process.env.FOOTBALL_API_KEY || "",
};

const basketballHeaders = {
  // Headers for api-basketball.com
  "x-apisports-key": process.env.BASKETBALL_APISPORTS_KEY || "",
};

// Create axios instances
const footballApi = axios.create({
  baseURL: FOOTBALL_API_URL,
  headers: footballHeaders,
});

const basketballApi = axios.create({
  // Updated for api-basketball.com
  baseURL: BASKETBALL_API_URL,
  headers: basketballHeaders,
});

// Cache for API responses
const cache = {
  matches: { data: null, timestamp: 0 },
  match: {}, // Cache for individual matches by ID
  teams: { data: null, timestamp: 0 },
  todaysMatches: { data: null, timestamp: 0 }, // New cache item
  competitionMatches: {}, // Cache for competition matches by code
  standings: {}, // Cache for standings by competition code
  scorers: {}, // Cache for scorers by competition code
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to check if cache is valid
const isCacheValid = (cacheItem) => {
  return cacheItem.data && Date.now() - cacheItem.timestamp < CACHE_DURATION;
};

// MOCK DATA for development when API keys are not available
const MOCK_FOOTBALL_MATCHES = {
  matches: [
    {
      id: 1,
      homeTeam: {
        id: 1,
        name: "Manchester United",
        crest: "https://crests.football-data.org/66.svg",
      },
      awayTeam: {
        id: 2,
        name: "Liverpool",
        crest: "https://crests.football-data.org/64.svg",
      },
      utcDate: new Date().toISOString(),
      competition: {
        id: 2021,
        name: "Premier League",
        code: "PL",
        type: "LEAGUE",
      },
      status: "SCHEDULED",
      venue: "Old Trafford",
      score: {
        fullTime: { homeTeam: null, awayTeam: null },
        halfTime: { homeTeam: null, awayTeam: null },
      },
      matchday: 1,
      group: null,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 2,
      homeTeam: {
        id: 3,
        name: "Arsenal",
        crest: "https://crests.football-data.org/57.svg",
      },
      awayTeam: {
        id: 4,
        name: "Chelsea",
        crest: "https://crests.football-data.org/61.svg",
      },
      utcDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      competition: {
        id: 2021,
        name: "Premier League",
        code: "PL",
        type: "LEAGUE",
      },
      status: "SCHEDULED",
      venue: "Emirates Stadium",
      score: {
        fullTime: { homeTeam: null, awayTeam: null },
        halfTime: { homeTeam: null, awayTeam: null },
      },
      matchday: 1,
      group: null,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "featured",
      homeTeam: {
        id: 5,
        name: "Barcelona",
        crest: "https://crests.football-data.org/81.svg",
      },
      awayTeam: {
        id: 6,
        name: "Real Madrid",
        crest: "https://crests.football-data.org/86.svg",
      },
      utcDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      competition: { id: 2014, name: "La Liga", code: "PD", type: "LEAGUE" },
      status: "SCHEDULED",
      venue: "Camp Nou",
      score: {
        fullTime: { homeTeam: null, awayTeam: null },
        halfTime: { homeTeam: null, awayTeam: null },
      },
      matchday: 1,
      group: null,
      lastUpdated: new Date().toISOString(),
    },
  ],
};

const MOCK_BASKETBALL_GAMES = {
  // New mock for api-basketball.com games
  response: [
    {
      id: 101,
      league: {
        id: 12,
        name: "NBA",
        type: "League",
        logo: "https://media.api-sports.io/basketball/leagues/12.png",
        season: "2023-2024",
      },
      date: new Date().toISOString(),
      status: { long: "Scheduled", short: "SCH", timer: null },
      teams: {
        home: {
          id: 1,
          name: "Boston Celtics",
          logo: "https://media.api-sports.io/basketball/teams/1.png",
        },
        away: {
          id: 2,
          name: "Los Angeles Lakers",
          logo: "https://media.api-sports.io/basketball/teams/2.png",
        },
      },
      scores: {
        home: { total: null },
        away: { total: null },
      },
      country: {
        id: 5,
        name: "USA",
        code: "US",
        flag: "https://media.api-sports.io/flags/us.svg",
      },
    },
    {
      id: 102,
      league: {
        id: 12,
        name: "NBA",
        type: "League",
        logo: "https://media.api-sports.io/basketball/leagues/12.png",
        season: "2023-2024",
      },
      date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      status: { long: "Scheduled", short: "SCH", timer: null },
      teams: {
        home: {
          id: 3,
          name: "Golden State Warriors",
          logo: "https://media.api-sports.io/basketball/teams/3.png",
        },
        away: {
          id: 4,
          name: "Brooklyn Nets",
          logo: "https://media.api-sports.io/basketball/teams/4.png",
        },
      },
      scores: {
        home: { total: null },
        away: { total: null },
      },
      country: {
        id: 5,
        name: "USA",
        code: "US",
        flag: "https://media.api-sports.io/flags/us.svg",
      },
    },
  ],
};

const MOCK_FOOTBALL_STANDINGS = {
  standings: [
    {
      table: [
        {
          position: 1,
          team: {
            id: 66,
            name: "Manchester United",
            crest: "https://crests.football-data.org/66.svg",
          },
          playedGames: 10,
          won: 8,
          draw: 1,
          lost: 1,
          points: 25,
          goalsFor: 20,
          goalsAgainst: 5,
          goalDifference: 15,
        },
        {
          position: 2,
          team: {
            id: 64,
            name: "Liverpool",
            crest: "https://crests.football-data.org/64.svg",
          },
          playedGames: 10,
          won: 7,
          draw: 2,
          lost: 1,
          points: 23,
          goalsFor: 18,
          goalsAgainst: 7,
          goalDifference: 11,
        },
      ],
    },
  ],
  competition: {
    name: "Premier League",
    code: "PL",
    emblem: "https://crests.football-data.org/PL.png",
  },
};

const MOCK_BASKETBALL_STANDINGS = {
  // New mock for api-basketball.com standings
  response: [
    {
      league: {
        id: 12, // NBA
        name: "NBA",
        country: {
          name: "USA",
          code: "US",
          flag: "https://media.api-sports.io/flags/us.svg",
        },
        logo: "https://media.api-sports.io/basketball/leagues/12.png",
        season: "2023-2024",
        standings: [
          // Array of groups/conferences
          [
            // Eastern Conference example
            {
              team: {
                id: 1,
                name: "Boston Celtics",
                logo: "https://media.api-sports.io/basketball/teams/1.png",
              },
              position: 1,
              games: {
                played: 10,
                win: { total: 8, percentage: ".800" },
                lose: { total: 2, percentage: ".200" },
              },
              group: { name: "Eastern Conference", points: "N/A" },
            },
            {
              team: {
                id: 5,
                name: "Miami Heat",
                logo: "https://media.api-sports.io/basketball/teams/5.png",
              },
              position: 2,
              games: {
                played: 10,
                win: { total: 7, percentage: ".700" },
                lose: { total: 3, percentage: ".300" },
              },
              group: { name: "Eastern Conference", points: "N/A" },
            },
          ],
        ],
      },
    },
  ],
};

const MOCK_FOOTBALL_SCORERS = {
  scorers: [
    {
      player: { id: 1, name: "Erling Haaland", nationality: "Norway" },
      team: { name: "Manchester City" },
      goals: 15,
      assists: 3,
      penalties: 2,
    },
    {
      player: { id: 2, name: "Mohamed Salah", nationality: "Egypt" },
      team: { name: "Liverpool" },
      goals: 12,
      assists: 5,
      penalties: 3,
    },
  ],
  competition: {
    name: "Premier League",
    code: "PL",
    emblem: "https://crests.football-data.org/PL.png",
  },
};

// Use mock data flag (can be set in .env)
const USE_MOCK_DATA =
  process.env.USE_MOCK_DATA === "true" ||
  (SPORT_TYPE === "football" && !process.env.FOOTBALL_API_KEY) ||
  (SPORT_TYPE === "basketball" && !process.env.BASKETBALL_APISPORTS_KEY);

// pull in competition code
const FOOTBALL_COMPETITION = process.env.FOOTBALL_COMPETITION || "PL";

// API service methods
const apiService = {
  // Get upcoming matches
  getUpcomingMatches: async () => {
    try {
      if (isCacheValid(cache.matches)) {
        return cache.matches.data;
      }

      if (USE_MOCK_DATA) {
        if (SPORT_TYPE === "football") {
          console.log(
            "Using mock football match data for development (getUpcomingMatches)"
          );
          cache.matches = {
            data: MOCK_FOOTBALL_MATCHES,
            timestamp: Date.now(),
          };
          return MOCK_FOOTBALL_MATCHES;
        } else {
          console.log(
            "Using mock basketball game data for development (getUpcomingMatches)"
          );
          cache.matches = {
            data: MOCK_BASKETBALL_GAMES,
            timestamp: Date.now(),
          };
          return MOCK_BASKETBALL_GAMES;
        }
      }

      let response;
      if (SPORT_TYPE === "football") {
        response = await footballApi.get(
          `/competitions/${FOOTBALL_COMPETITION}/matches?status=SCHEDULED`
        );
      } else {
        // Basketball - api-basketball.com
        const today = new Date().toISOString().split("T")[0];
        // Fetching games for today for a specific league (e.g., NBA - league ID 12) and current season
        // Adjust league and season as needed, or make them configurable
        const currentSeason = `${
          new Date().getFullYear() - 1
        }-${new Date().getFullYear()}`; // e.g., 2023-2024
        response = await basketballApi.get(
          `/games?date=${today}&league=12&season=${currentSeason}`
        );
        // The response from api-basketball is { ..., response: [...] }
        // To match the structure client might expect (e.g., { matches: [...] }), we wrap it.
        // However, it's better if the client adapts to the { response: [...] } structure.
        // For now, returning raw response.data
      }

      cache.matches = { data: response.data, timestamp: Date.now() };
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming matches/games:", error.message);
      console.log("API error - Using mock data as fallback");
      const mockData =
        SPORT_TYPE === "football"
          ? MOCK_FOOTBALL_MATCHES
          : MOCK_BASKETBALL_GAMES;
      cache.matches = { data: mockData, timestamp: Date.now() };
      return mockData;
    }
  },

  // Get match details by ID
  getMatchById: async (matchId) => {
    try {
      if (cache.match[matchId] && isCacheValid(cache.match[matchId])) {
        return cache.match[matchId].data;
      }

      if (USE_MOCK_DATA) {
        let mockMatchData;
        if (SPORT_TYPE === "football") {
          const foundMatch = MOCK_FOOTBALL_MATCHES.matches.find(
            (m) =>
              m.id.toString() === matchId.toString() ||
              (matchId === "featured" && m.id === "featured")
          );
          mockMatchData = {
            match: foundMatch || MOCK_FOOTBALL_MATCHES.matches[0],
          };
        } else {
          // Basketball
          const foundGame = MOCK_BASKETBALL_GAMES.response.find(
            (g) => g.id.toString() === matchId.toString()
          );
          // api-basketball.com returns the game object directly in the response array
          mockMatchData = {
            response: [foundGame || MOCK_BASKETBALL_GAMES.response[0]],
          };
        }
        console.log(
          `Using mock data for development (getMatchById: ${matchId}, type: ${SPORT_TYPE})`
        );
        cache.match[matchId] = { data: mockMatchData, timestamp: Date.now() };
        return mockMatchData;
      }

      let response;
      if (SPORT_TYPE === "football") {
        response = await footballApi.get(`/matches/${matchId}`);
      } else {
        // Basketball - api-basketball.com
        response = await basketballApi.get(`/games?id=${matchId}`);
      }

      cache.match[matchId] = { data: response.data, timestamp: Date.now() };
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching match/game with ID ${matchId}:`,
        error.message
      );
      console.log("API error - Using mock data as fallback (getMatchById)");
      let fallbackMock;
      if (SPORT_TYPE === "football") {
        const foundMatch =
          MOCK_FOOTBALL_MATCHES.matches.find(
            (m) => m.id.toString() === matchId
          ) || MOCK_FOOTBALL_MATCHES.matches[0];
        fallbackMock = { match: foundMatch };
      } else {
        const foundGame =
          MOCK_BASKETBALL_GAMES.response.find(
            (g) => g.id.toString() === matchId
          ) || MOCK_BASKETBALL_GAMES.response[0];
        fallbackMock = { response: [foundGame] };
      }
      cache.match[matchId] = { data: fallbackMock, timestamp: Date.now() };
      return fallbackMock;
    }
  },

  // Get team details by ID
  getTeamById: async (teamId) => {
    try {
      if (USE_MOCK_DATA) {
        console.log(
          `Using mock team data for development (getTeamById: ${teamId}, type: ${SPORT_TYPE})`
        );
        if (SPORT_TYPE === "football") {
          return {
            id: teamId,
            name: `Team ${teamId}`,
            crest: "https://via.placeholder.com/150",
          };
        } else {
          // Basketball mock
          return {
            response: [
              {
                id: teamId,
                name: `Basketball Team ${teamId}`,
                logo: "https://via.placeholder.com/150",
              },
            ],
          };
        }
      }

      let response;
      if (SPORT_TYPE === "football") {
        response = await footballApi.get(`/teams/${teamId}`);
      } else {
        // Basketball - api-basketball.com
        response = await basketballApi.get(`/teams?id=${teamId}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching team with ID ${teamId}:`, error.message);
      if (
        USE_MOCK_DATA ||
        [401, 403, 404, 499, 500].includes(error.response?.status) ||
        !error.response
      ) {
        // Added 499, 500 for api-sports common errors
        console.log(`API error/mock fallback for getTeamById: ${teamId}`);
        if (SPORT_TYPE === "football") {
          return {
            id: teamId,
            name: `Team ${teamId}`,
            crest: "https://via.placeholder.com/150",
          };
        } else {
          return {
            response: [
              {
                id: teamId,
                name: `Basketball Team ${teamId}`,
                logo: "https://via.placeholder.com/150",
              },
            ],
          };
        }
      }
      throw error;
    }
  },

  // Get head-to-head statistics - This is complex for basketball and may not have a direct equivalent or might be part of game details.
  // For now, it will primarily be football-focused or return a generic message for basketball.
  getHeadToHead: async (team1Id, team2Id) => {
    try {
      if (SPORT_TYPE === "basketball") {
        // api-basketball.com has H2H endpoint: /games/h2h?h2h=ID1-ID2
        if (USE_MOCK_DATA) {
          console.log(
            `Using mock H2H data for basketball (${team1Id} vs ${team2Id})`
          );
          return { response: MOCK_BASKETBALL_GAMES.response.slice(0, 1) }; // Return a mock game as H2H
        }
        const response = await basketballApi.get(
          `/games/h2h?h2h=${team1Id}-${team2Id}`
        );
        return response.data;
      }
      // Football logic remains
      if (USE_MOCK_DATA) {
        console.log(
          `Using mock H2H data for development (${team1Id} vs ${team2Id})`
        );
        return { message: "Head-to-head mock data" };
      }

      if (SPORT_TYPE === "football") {
        const response = await footballApi.get(
          `/teams/${team1Id}/matches?status=FINISHED&opponent=${team2Id}`
        );
        return response.data;
      } else {
        return { message: "Head-to-head not supported for basketball" };
      }
    } catch (error) {
      console.error(
        `Error fetching head-to-head for ${team1Id} vs ${team2Id}:`,
        error
      );
      if (USE_MOCK_DATA || [401, 403, 404].includes(error.response?.status)) {
        console.log(`API error/mock fallback for getHeadToHead`);
        return { message: "No head-to-head data available" };
      }
      throw error;
    }
  },

  // NEW V4 METHODS

  // Get today's matches for subscribed competitions
  getTodaysMatches: async () => {
    try {
      if (isCacheValid(cache.todaysMatches)) {
        return cache.todaysMatches.data;
      }
      if (USE_MOCK_DATA) {
        const mockData =
          SPORT_TYPE === "football"
            ? MOCK_FOOTBALL_MATCHES
            : MOCK_BASKETBALL_GAMES;
        console.log(
          `Using mock data for today's matches (getTodaysMatches, type: ${SPORT_TYPE})`
        );
        cache.todaysMatches = { data: mockData, timestamp: Date.now() };
        return mockData;
      }

      let response;
      if (SPORT_TYPE === "football") {
        response = await footballApi.get("/matches"); // V4 endpoint for today's matches (subscribed)
      } else {
        // Basketball - api-basketball.com
        const today = new Date().toISOString().split("T")[0];
        // Example: NBA (league 12), current season. Adjust as needed.
        const currentSeason = `${
          new Date().getFullYear() - 1
        }-${new Date().getFullYear()}`;
        response = await basketballApi.get(
          `/games?date=${today}&league=12&season=${currentSeason}`
        );
      }
      cache.todaysMatches = { data: response.data, timestamp: Date.now() };
      return response.data;
    } catch (error) {
      console.error("Error fetching today's matches/games:", error.message);
      console.log("API error - Using mock data as fallback (getTodaysMatches)");
      const mockData =
        SPORT_TYPE === "football"
          ? MOCK_FOOTBALL_MATCHES
          : MOCK_BASKETBALL_GAMES;
      cache.todaysMatches = { data: mockData, timestamp: Date.now() };
      return mockData;
    }
  },

  // Get all matches of a specific competition (football) / league (basketball)
  getCompetitionMatches: async (competitionCodeOrLeagueId, season) => {
    // Added season for basketball
    const cacheKey = `competitionMatches_${competitionCodeOrLeagueId}_${
      season || ""
    }`;
    if (
      cache.competitionMatches[cacheKey] &&
      isCacheValid(cache.competitionMatches[cacheKey])
    ) {
      return cache.competitionMatches[cacheKey].data;
    }
    try {
      if (USE_MOCK_DATA) {
        const mockData =
          SPORT_TYPE === "football"
            ? MOCK_FOOTBALL_MATCHES
            : MOCK_BASKETBALL_GAMES;
        console.log(
          `Using mock data for ${SPORT_TYPE} matches: ${competitionCodeOrLeagueId} (getCompetitionMatches)`
        );
        cache.competitionMatches[cacheKey] = {
          data: mockData,
          timestamp: Date.now(),
        };
        return mockData;
      }
      let response;
      if (SPORT_TYPE === "football") {
        response = await footballApi.get(
          `/competitions/${competitionCodeOrLeagueId}/matches`
        );
      } else {
        // Basketball - api-basketball.com
        if (!season)
          throw new Error("Season is required for basketball league games.");
        // competitionCodeOrLeagueId is leagueId for basketball
        response = await basketballApi.get(
          `/games?league=${competitionCodeOrLeagueId}&season=${season}`
        );
      }
      cache.competitionMatches[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
      };
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching matches for ${SPORT_TYPE} ${competitionCodeOrLeagueId}:`,
        error.message
      );
      const mockData =
        SPORT_TYPE === "football"
          ? MOCK_FOOTBALL_MATCHES
          : MOCK_BASKETBALL_GAMES;
      cache.competitionMatches[cacheKey] = {
        data: mockData,
        timestamp: Date.now(),
      };
      return mockData;
    }
  },

  // Get league table for a competition (football) / league (basketball)
  getCompetitionStandings: async (competitionCodeOrLeagueId, season) => {
    // Added season for basketball
    const cacheKey = `standings_${competitionCodeOrLeagueId}_${season || ""}`;
    if (cache.standings[cacheKey] && isCacheValid(cache.standings[cacheKey])) {
      return cache.standings[cacheKey].data;
    }
    try {
      if (USE_MOCK_DATA) {
        const mockData =
          SPORT_TYPE === "football"
            ? MOCK_FOOTBALL_STANDINGS
            : MOCK_BASKETBALL_STANDINGS;
        console.log(
          `Using mock data for ${SPORT_TYPE} standings: ${competitionCodeOrLeagueId} (getCompetitionStandings)`
        );
        cache.standings[cacheKey] = { data: mockData, timestamp: Date.now() };
        return mockData;
      }
      let response;
      if (SPORT_TYPE === "football") {
        response = await footballApi.get(
          `/competitions/${competitionCodeOrLeagueId}/standings`
        );
      } else {
        // Basketball - api-basketball.com
        if (!season)
          throw new Error("Season is required for basketball standings.");
        // competitionCodeOrLeagueId is leagueId for basketball
        response = await basketballApi.get(
          `/standings?league=${competitionCodeOrLeagueId}&season=${season}`
        );
      }
      cache.standings[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
      };
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching standings for ${SPORT_TYPE} ${competitionCodeOrLeagueId}:`,
        error.message
      );
      const mockData =
        SPORT_TYPE === "football"
          ? MOCK_FOOTBALL_STANDINGS
          : MOCK_BASKETBALL_STANDINGS;
      cache.standings[cacheKey] = { data: mockData, timestamp: Date.now() };
      return mockData;
    }
  },

  // Get scorers for a competition (football) / league (basketball)
  getCompetitionScorers: async (competitionCodeOrLeagueId, season) => {
    // Added season for basketball
    const cacheKey = `scorers_${competitionCodeOrLeagueId}_${season || ""}`;
    if (cache.scorers[cacheKey] && isCacheValid(cache.scorers[cacheKey])) {
      return cache.scorers[cacheKey].data;
    }
    try {
      if (USE_MOCK_DATA) {
        // Assuming MOCK_FOOTBALL_SCORERS is somewhat generic or you'd create MOCK_BASKETBALL_SCORERS
        const mockData =
          SPORT_TYPE === "football" ? MOCK_FOOTBALL_SCORERS : { response: [] }; // Placeholder for basketball scorers
        console.log(
          `Using mock data for ${SPORT_TYPE} scorers: ${competitionCodeOrLeagueId} (getCompetitionScorers)`
        );
        cache.scorers[cacheKey] = { data: mockData, timestamp: Date.now() };
        return mockData;
      }
      let response;
      if (SPORT_TYPE === "football") {
        response = await footballApi.get(
          `/competitions/${competitionCodeOrLeagueId}/scorers`
        );
      } else {
        // Basketball - api-basketball.com
        // Endpoint for player stats / top scorers might be /players/statistics or /players/topscorers
        // Example: /players/topscorers?league=12&season=2023-2024
        if (!season)
          throw new Error("Season is required for basketball scorers.");
        response = await basketballApi.get(
          `/players/topscorers?league=${competitionCodeOrLeagueId}&season=${season}`
        );
      }
      cache.scorers[cacheKey] = { data: response.data, timestamp: Date.now() };
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching scorers for ${SPORT_TYPE} ${competitionCodeOrLeagueId}:`,
        error.message
      );
      const mockData =
        SPORT_TYPE === "football" ? MOCK_FOOTBALL_SCORERS : { response: [] };
      cache.scorers[cacheKey] = { data: mockData, timestamp: Date.now() };
      return mockData;
    }
  },

  // Add a new function to get previous matches
  getPreviousMatches: async (sportType = SPORT_TYPE) => {
    const cacheKey = `previousMatches_${sportType}`;
    if (cache[cacheKey] && isCacheValid(cache[cacheKey])) {
      return cache[cacheKey].data;
    }

    try {
      if (USE_MOCK_DATA) {
        // Create mock data for previous matches
        let mockData;
        if (sportType === "football") {
          // Clone the mock matches and change status to FINISHED
          mockData = JSON.parse(JSON.stringify(MOCK_FOOTBALL_MATCHES));
          mockData.matches = mockData.matches.map((match) => ({
            ...match,
            status: "FINISHED",
            score: {
              ...match.score,
              fullTime: {
                homeTeam: Math.floor(Math.random() * 5),
                awayTeam: Math.floor(Math.random() * 5),
              },
            },
          }));
        } else {
          // Clone the mock basketball games and change status to final
          mockData = JSON.parse(JSON.stringify(MOCK_BASKETBALL_GAMES));
          mockData.response = mockData.response.map((game) => ({
            ...game,
            status: { ...game.status, long: "Game Finished", short: "FT" },
            scores: {
              home: { total: Math.floor(Math.random() * 120) + 70 },
              away: { total: Math.floor(Math.random() * 120) + 70 },
            },
          }));
        }

        console.log(`Using mock data for previous ${sportType} matches`);
        cache[cacheKey] = { data: mockData, timestamp: Date.now() };
        return mockData;
      }

      let response;
      if (sportType === "football") {
        // Get matches that have finished in the last 7 days
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        const dateFrom = lastWeek.toISOString().split("T")[0];
        const dateTo = today.toISOString().split("T")[0];

        response = await footballApi.get(
          `/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&status=FINISHED`
        );
      } else {
        // Basketball - get previous games
        const today = new Date().toISOString().split("T")[0];
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastWeekStr = lastWeek.toISOString().split("T")[0];

        // For basketball, we need to get games from a week ago to yesterday
        const currentSeason = `${
          new Date().getFullYear() - 1
        }-${new Date().getFullYear()}`;
        response = await basketballApi.get(
          `/games?league=12&season=${currentSeason}&dates[]=${lastWeekStr}&dates[]=${today}`
        );
      }

      cache[cacheKey] = { data: response.data, timestamp: Date.now() };
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching previous ${sportType} matches:`,
        error.message
      );
      // Return mock data as fallback
      const mockData =
        sportType === "football"
          ? MOCK_FOOTBALL_MATCHES
          : MOCK_BASKETBALL_GAMES;
      cache[cacheKey] = { data: mockData, timestamp: Date.now() };
      return mockData;
    }
  },
};

module.exports = apiService;

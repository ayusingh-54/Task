const axios = require("axios");
require("dotenv").config();

// API configuration
const CRICKET_API_URL = "https://cricbuzz-cricket.p.rapidapi.com";

// API headers
const cricketHeaders = {
  "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
  "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com",
};

// Create axios instance
const cricketApi = axios.create({
  baseURL: CRICKET_API_URL,
  headers: cricketHeaders,
});

// Cache for API responses
const cache = {
  matches: { data: null, timestamp: 0 },
  matchDetails: {}, // Cache for individual matches by ID
  series: { data: null, timestamp: 0 },
  teams: { data: null, timestamp: 0 },
  players: { data: null, timestamp: 0 },
  news: { data: null, timestamp: 0 },
  previousMatches: { data: null, timestamp: 0 }, // Cache for previous matches
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Conditional logging flag - only log in development mode
const ENABLE_DEBUG_LOGGING = process.env.NODE_ENV !== "production";

// Helper function to check if cache is valid
const isCacheValid = (cacheItem) => {
  return cacheItem.data && Date.now() - cacheItem.timestamp < CACHE_DURATION;
};

// MOCK DATA for development when API keys are not available
const MOCK_CRICKET_MATCHES = {
  matches: [
    // Add some current IPL matches
    {
      id: "cricket-match-ipl-1",
      matchInfo: {
        matchId: "cricket-match-ipl-1",
        seriesName: "IPL 2024",
        matchDesc: "Match 42",
        matchFormat: "T20",
        startDate: new Date().toISOString(), // Today
        endDate: new Date(Date.now() + 14400000).toISOString(), // 4 hours later
        state: "In Progress",
        status: "Chennai Super Kings batting",
        team1: {
          teamId: 5,
          teamName: "Chennai Super Kings",
          teamSName: "CSK",
          imageId: 225373,
        },
        team2: {
          teamId: 6,
          teamName: "Mumbai Indians",
          teamSName: "MI",
          imageId: 225378,
        },
        venueInfo: {
          id: 56,
          ground: "MA Chidambaram Stadium",
          city: "Chennai",
          timezone: "+05:30",
        },
      },
      matchScore: {
        team1Score: {
          inngs1: {
            runs: 156,
            wickets: 4,
            overs: 15.2,
          },
        },
        team2Score: {
          inngs1: {
            runs: 0,
            wickets: 0,
            overs: 0,
          },
        },
      },
    },
    {
      id: "cricket-match-ipl-2",
      matchInfo: {
        matchId: "cricket-match-ipl-2",
        seriesName: "IPL 2024",
        matchDesc: "Match 43",
        matchFormat: "T20",
        startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 86400000 + 14400000).toISOString(),
        state: "Upcoming",
        status: "Match starts tomorrow",
        team1: {
          teamId: 7,
          teamName: "Royal Challengers Bangalore",
          teamSName: "RCB",
          imageId: 225374,
        },
        team2: {
          teamId: 8,
          teamName: "Kolkata Knight Riders",
          teamSName: "KKR",
          imageId: 225379,
        },
        venueInfo: {
          id: 57,
          ground: "M. Chinnaswamy Stadium",
          city: "Bangalore",
          timezone: "+05:30",
        },
      },
    },
    {
      id: "cricket-match-ipl-3",
      matchInfo: {
        matchId: "cricket-match-ipl-3",
        seriesName: "IPL 2024",
        matchDesc: "Match 41",
        matchFormat: "T20",
        startDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        endDate: new Date(Date.now() - 72000000).toISOString(), // Yesterday + 4 hours
        state: "Complete",
        status: "Rajasthan Royals won by 6 wickets",
        team1: {
          teamId: 9,
          teamName: "Delhi Capitals",
          teamSName: "DC",
          imageId: 225375,
        },
        team2: {
          teamId: 10,
          teamName: "Rajasthan Royals",
          teamSName: "RR",
          imageId: 225380,
        },
        venueInfo: {
          id: 58,
          ground: "Arun Jaitley Stadium",
          city: "Delhi",
          timezone: "+05:30",
        },
      },
      matchScore: {
        team1Score: {
          inngs1: {
            runs: 175,
            wickets: 10,
            overs: 19.5,
          },
        },
        team2Score: {
          inngs1: {
            runs: 176,
            wickets: 4,
            overs: 18.2,
          },
        },
      },
    },
    {
      id: "cricket-match-1",
      matchInfo: {
        matchId: "cricket-match-1",
        seriesName: "ICC World Cup",
        matchDesc: "1st Test",
        matchFormat: "TEST",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        state: "In Progress",
        status: "Day 1: Session 1",
        team1: {
          teamId: 2,
          teamName: "India",
          teamSName: "IND",
          imageId: 172115,
        },
        team2: {
          teamId: 3,
          teamName: "Australia",
          teamSName: "AUS",
          imageId: 172127,
        },
        venueInfo: {
          id: 14,
          ground: "Melbourne Cricket Ground",
          city: "Melbourne",
          timezone: "+11:00",
        },
      },
      matchScore: {
        team1Score: {
          inngs1: {
            runs: 245,
            wickets: 8,
            overs: 65.4,
          },
        },
        team2Score: {
          inngs1: {
            runs: 0,
            wickets: 0,
            overs: 0,
          },
        },
      },
    },
    {
      id: "cricket-match-2",
      matchInfo: {
        matchId: "cricket-match-2",
        seriesName: "IPL 2023",
        matchDesc: "Match 42",
        matchFormat: "T20",
        startDate: new Date(Date.now() + 172800000).toISOString(),
        endDate: new Date(Date.now() + 172800000 + 14400000).toISOString(),
        state: "Upcoming",
        status: "Match starts at 19:30",
        team1: {
          teamId: 5,
          teamName: "Chennai Super Kings",
          teamSName: "CSK",
          imageId: 225373,
        },
        team2: {
          teamId: 6,
          teamName: "Mumbai Indians",
          teamSName: "MI",
          imageId: 225378,
        },
        venueInfo: {
          id: 56,
          ground: "MA Chidambaram Stadium",
          city: "Chennai",
          timezone: "+05:30",
        },
      },
    },
    {
      id: "cricket-match-3",
      matchInfo: {
        matchId: "cricket-match-3",
        seriesName: "The Ashes",
        matchDesc: "3rd Test",
        matchFormat: "TEST",
        startDate: new Date(Date.now() - 86400000).toISOString(),
        endDate: new Date(Date.now() + 259200000).toISOString(),
        state: "In Progress",
        status: "Day 2: Session 2",
        team1: {
          teamId: 3,
          teamName: "England",
          teamSName: "ENG",
          imageId: 172142,
        },
        team2: {
          teamId: 4,
          teamName: "Australia",
          teamSName: "AUS",
          imageId: 172127,
        },
        venueInfo: {
          id: 23,
          ground: "Lords",
          city: "London",
          timezone: "+01:00",
        },
      },
      matchScore: {
        team1Score: {
          inngs1: {
            runs: 356,
            wickets: 10,
            overs: 112.2,
          },
        },
        team2Score: {
          inngs1: {
            runs: 124,
            wickets: 4,
            overs: 35.2,
          },
        },
      },
    },
  ],
};

// Use mock data flag (can be set in .env)
const USE_MOCK_DATA =
  process.env.USE_MOCK_DATA === "true" || !process.env.RAPIDAPI_KEY;

// Cricket API service methods
const cricketApiService = {
  // Get list of live and upcoming matches
  getMatches: async () => {
    try {
      if (isCacheValid(cache.matches)) {
        return cache.matches.data;
      }
      if (USE_MOCK_DATA) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("Using mock cricket match data for development");
        }
        cache.matches = {
          data: MOCK_CRICKET_MATCHES,
          timestamp: Date.now(),
        };
        return MOCK_CRICKET_MATCHES;
      }

      const response = await cricketApi.get("/matches/list");
      cache.matches = {
        data: response.data,
        timestamp: Date.now(),
      };
      return response.data;
    } catch (error) {
      console.error("Error fetching cricket matches:", error.message);
      if (ENABLE_DEBUG_LOGGING) {
        console.log("API error - Using mock cricket match data as fallback");
      }
      cache.matches = {
        data: MOCK_CRICKET_MATCHES,
        timestamp: Date.now(),
      };
      return MOCK_CRICKET_MATCHES;
    }
  },

  // Get match details by ID
  getMatchInfo: async (matchId) => {
    try {
      if (
        cache.matchDetails[matchId] &&
        isCacheValid(cache.matchDetails[matchId])
      ) {
        return cache.matchDetails[matchId].data;
      }
      if (USE_MOCK_DATA) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            `Using mock cricket match data for development (getMatchInfo: ${matchId})`
          );
        }
        const mockMatch =
          MOCK_CRICKET_MATCHES.matches.find((m) => m.id === matchId) ||
          MOCK_CRICKET_MATCHES.matches[0];
        cache.matchDetails[matchId] = {
          data: mockMatch,
          timestamp: Date.now(),
        };
        return mockMatch;
      }

      const response = await cricketApi.get(
        `/matches/get-info?matchId=${matchId}`
      );
      cache.matchDetails[matchId] = {
        data: response.data,
        timestamp: Date.now(),
      };
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching cricket match info with ID ${matchId}:`,
        error.message
      );
      if (ENABLE_DEBUG_LOGGING) {
        console.log(
          "API error - Using mock match data as fallback (getMatchInfo)"
        );
      }
      const mockMatch =
        MOCK_CRICKET_MATCHES.matches.find((m) => m.id === matchId) ||
        MOCK_CRICKET_MATCHES.matches[0];
      return mockMatch;
    }
  },

  // Get match scorecard
  getMatchScorecard: async (matchId) => {
    try {
      if (USE_MOCK_DATA) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            `Using mock cricket scorecard data for development (matchId: ${matchId})`
          );
        }
        const mockMatch =
          MOCK_CRICKET_MATCHES.matches.find((m) => m.id === matchId) ||
          MOCK_CRICKET_MATCHES.matches[0];
        return mockMatch.matchScore || {};
      }

      const response = await cricketApi.get(
        `/matches/get-scorecard?matchId=${matchId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching cricket match scorecard with ID ${matchId}:`,
        error.message
      );
      if (ENABLE_DEBUG_LOGGING) {
        console.log("API error - Using mock scorecard data as fallback");
      }
      const mockMatch =
        MOCK_CRICKET_MATCHES.matches.find((m) => m.id === matchId) ||
        MOCK_CRICKET_MATCHES.matches[0];
      return mockMatch.matchScore || {};
    }
  },

  // Get match commentary
  getMatchCommentary: async (matchId) => {
    try {
      if (USE_MOCK_DATA) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            `Using mock cricket commentary data for development (matchId: ${matchId})`
          );
        }
        return { commentary: "No commentary available in mock data" };
      }

      const response = await cricketApi.get(
        `/matches/get-commentaries?matchId=${matchId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching cricket match commentary with ID ${matchId}:`,
        error.message
      );
      if (ENABLE_DEBUG_LOGGING) {
        console.log("API error - Using mock commentary data as fallback");
      }
      return { commentary: "No commentary available" };
    }
  },

  // Get series list
  getSeriesList: async () => {
    try {
      if (isCacheValid(cache.series)) {
        return cache.series.data;
      }

      if (USE_MOCK_DATA) {
        console.log("Using mock cricket series data for development");
        const mockData = {
          seriesList: [
            {
              id: "s1",
              name: "ICC World Cup 2023",
              startDate: "2023-10-05",
              endDate: "2023-11-19",
            },
            {
              id: "s2",
              name: "The Ashes",
              startDate: "2023-06-16",
              endDate: "2023-07-31",
            },
            {
              id: "s3",
              name: "IPL 2023",
              startDate: "2023-03-31",
              endDate: "2023-05-28",
            },
          ],
        };
        cache.series = {
          data: mockData,
          timestamp: Date.now(),
        };
        return mockData;
      }

      const response = await cricketApi.get("/series/list");
      cache.series = {
        data: response.data,
        timestamp: Date.now(),
      };
      return response.data;
    } catch (error) {
      console.error("Error fetching cricket series list:", error.message);
      console.log("API error - Using mock series data as fallback");
      const mockData = {
        seriesList: [
          {
            id: "s1",
            name: "ICC World Cup 2023",
            startDate: "2023-10-05",
            endDate: "2023-11-19",
          },
          {
            id: "s2",
            name: "The Ashes",
            startDate: "2023-06-16",
            endDate: "2023-07-31",
          },
          {
            id: "s3",
            name: "IPL 2023",
            startDate: "2023-03-31",
            endDate: "2023-05-28",
          },
        ],
      };
      cache.series = {
        data: mockData,
        timestamp: Date.now(),
      };
      return mockData;
    }
  },

  // Get news list
  getNewsList: async () => {
    try {
      if (isCacheValid(cache.news)) {
        return cache.news.data;
      }

      if (USE_MOCK_DATA) {
        console.log("Using mock cricket news data for development");
        const mockData = {
          newsList: [
            {
              id: "n1",
              headline: "India wins World Cup",
              description: "India defeats Australia in the final",
            },
            {
              id: "n2",
              headline: "England announces squad for the Ashes",
              description: "Root to lead the team",
            },
            {
              id: "n3",
              headline: "IPL auction results",
              description: "Full list of players bought by teams",
            },
          ],
        };
        cache.news = {
          data: mockData,
          timestamp: Date.now(),
        };
        return mockData;
      }

      const response = await cricketApi.get("/news/list");
      cache.news = {
        data: response.data,
        timestamp: Date.now(),
      };
      return response.data;
    } catch (error) {
      console.error("Error fetching cricket news list:", error.message);
      console.log("API error - Using mock news data as fallback");
      const mockData = {
        newsList: [
          {
            id: "n1",
            headline: "India wins World Cup",
            description: "India defeats Australia in the final",
          },
          {
            id: "n2",
            headline: "England announces squad for the Ashes",
            description: "Root to lead the team",
          },
          {
            id: "n3",
            headline: "IPL auction results",
            description: "Full list of players bought by teams",
          },
        ],
      };
      cache.news = {
        data: mockData,
        timestamp: Date.now(),
      };
      return mockData;
    }
  },

  // Get IPL matches specifically
  getIplMatches: async () => {
    try {
      if (USE_MOCK_DATA) {
        console.log("Using mock IPL cricket match data for development");
        // Filter only IPL matches from the mock data
        const iplMatches = {
          matches: MOCK_CRICKET_MATCHES.matches.filter((match) =>
            match.matchInfo?.seriesName?.includes("IPL")
          ),
        };
        return iplMatches;
      }

      // Make actual API call to get IPL matches
      // The API might have a parameter for tournament/series
      const response = await cricketApi.get("/matches/list?tournament=ipl");
      return response.data;
    } catch (error) {
      console.error("Error fetching IPL cricket matches:", error.message);
      console.log("API error - Using mock IPL match data as fallback");
      // Filter only IPL matches
      const iplMatches = {
        matches: MOCK_CRICKET_MATCHES.matches.filter((match) =>
          match.matchInfo?.seriesName?.includes("IPL")
        ),
      };
      return iplMatches;
    }
  },

  // Get previous matches
  getPreviousMatches: async () => {
    try {
      if (isCacheValid(cache.previousMatches)) {
        return cache.previousMatches.data;
      }

      if (USE_MOCK_DATA) {
        console.log("Using mock previous cricket match data for development");

        // Generate mock previous matches
        const mockPreviousMatches = {
          matches: [
            {
              id: "cricket-prev-1",
              matchInfo: {
                matchId: "cricket-prev-1",
                seriesName: "IPL 2024",
                matchDesc: "Match 37",
                matchFormat: "T20",
                startDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                endDate: new Date(Date.now() - 158400000).toISOString(),
                state: "Complete",
                status: "Chennai Super Kings won by 8 wickets",
                team1: {
                  teamId: 5,
                  teamName: "Mumbai Indians",
                  teamSName: "MI",
                  imageId: 225378,
                },
                team2: {
                  teamId: 6,
                  teamName: "Chennai Super Kings",
                  teamSName: "CSK",
                  imageId: 225373,
                },
                venueInfo: {
                  id: 56,
                  ground: "Wankhede Stadium",
                  city: "Mumbai",
                  timezone: "+05:30",
                },
              },
              matchScore: {
                team1Score: {
                  inngs1: {
                    runs: 155,
                    wickets: 10,
                    overs: 19.2,
                  },
                },
                team2Score: {
                  inngs1: {
                    runs: 156,
                    wickets: 2,
                    overs: 17.4,
                  },
                },
              },
            },
            {
              id: "cricket-prev-2",
              matchInfo: {
                matchId: "cricket-prev-2",
                seriesName: "Test Series: India vs England",
                matchDesc: "3rd Test",
                matchFormat: "TEST",
                startDate: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
                endDate: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
                state: "Complete",
                status: "India won by an innings and 64 runs",
                team1: {
                  teamId: 7,
                  teamName: "India",
                  teamSName: "IND",
                  imageId: 225374,
                },
                team2: {
                  teamId: 8,
                  teamName: "England",
                  teamSName: "ENG",
                  imageId: 225379,
                },
                venueInfo: {
                  id: 57,
                  ground: "Narendra Modi Stadium",
                  city: "Ahmedabad",
                  timezone: "+05:30",
                },
              },
              matchScore: {
                team1Score: {
                  inngs1: {
                    runs: 436,
                    wickets: 10,
                    overs: 121.3,
                  },
                },
                team2Score: {
                  inngs1: {
                    runs: 152,
                    wickets: 10,
                    overs: 53.2,
                  },
                  inngs2: {
                    runs: 220,
                    wickets: 10,
                    overs: 67.4,
                  },
                },
              },
            },
            {
              id: "cricket-prev-3",
              matchInfo: {
                matchId: "cricket-prev-3",
                seriesName: "IPL 2024",
                matchDesc: "Match 36",
                matchFormat: "T20",
                startDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                endDate: new Date(Date.now() - 244800000).toISOString(),
                state: "Complete",
                status: "Royal Challengers Bangalore won by 5 wickets",
                team1: {
                  teamId: 9,
                  teamName: "Delhi Capitals",
                  teamSName: "DC",
                  imageId: 225375,
                },
                team2: {
                  teamId: 10,
                  teamName: "Royal Challengers Bangalore",
                  teamSName: "RCB",
                  imageId: 225380,
                },
                venueInfo: {
                  id: 58,
                  ground: "M. Chinnaswamy Stadium",
                  city: "Bangalore",
                  timezone: "+05:30",
                },
              },
              matchScore: {
                team1Score: {
                  inngs1: {
                    runs: 175,
                    wickets: 9,
                    overs: 20.0,
                  },
                },
                team2Score: {
                  inngs1: {
                    runs: 177,
                    wickets: 5,
                    overs: 19.1,
                  },
                },
              },
            },
          ],
        };

        cache.previousMatches = {
          data: mockPreviousMatches,
          timestamp: Date.now(),
        };
        return mockPreviousMatches;
      }

      // For real API, query completed matches
      const response = await cricketApi.get("/matches/list?status=completed");
      cache.previousMatches = {
        data: response.data,
        timestamp: Date.now(),
      };
      return response.data;
    } catch (error) {
      console.error("Error fetching previous cricket matches:", error.message);

      // Return mock data as fallback
      const mockPreviousMatches = {
        matches: [
          {
            id: "cricket-prev-1",
            matchInfo: {
              matchId: "cricket-prev-1",
              seriesName: "IPL 2024",
              matchDesc: "Match 37",
              matchFormat: "T20",
              startDate: new Date(Date.now() - 172800000).toISOString(),
              endDate: new Date(Date.now() - 158400000).toISOString(),
              state: "Complete",
              status: "Chennai Super Kings won by 8 wickets",
              team1: {
                teamId: 5,
                teamName: "Mumbai Indians",
                teamSName: "MI",
                imageId: 225378,
              },
              team2: {
                teamId: 6,
                teamName: "Chennai Super Kings",
                teamSName: "CSK",
                imageId: 225373,
              },
              venueInfo: {
                id: 56,
                ground: "Wankhede Stadium",
                city: "Mumbai",
                timezone: "+05:30",
              },
            },
            matchScore: {
              team1Score: {
                inngs1: {
                  runs: 155,
                  wickets: 10,
                  overs: 19.2,
                },
              },
              team2Score: {
                inngs1: {
                  runs: 156,
                  wickets: 2,
                  overs: 17.4,
                },
              },
            },
          },
        ],
      };

      return mockPreviousMatches;
    }
  },
};

module.exports = cricketApiService;

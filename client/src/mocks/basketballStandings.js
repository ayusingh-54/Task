/**
 * Mock data for basketball standings
 * Used as fallback when API is unavailable
 */

const MOCK_NBA_STANDINGS = {
  response: [
    {
      league: {
        id: 12,
        name: "NBA",
        type: "League",
        season: "2023-2024",
        logo: "https://media.api-sports.io/basketball/leagues/12.png",
        standings: [
          // Eastern Conference
          [
            {
              position: 1,
              stage: "Regular Season",
              group: {
                name: "Eastern Conference",
                points: null,
              },
              team: {
                id: 139,
                name: "Boston Celtics",
                logo: "https://media.api-sports.io/basketball/teams/139.png",
              },
              league: {
                id: 12,
                name: "NBA",
                type: "League",
                season: "2023-2024",
                logo: "https://media.api-sports.io/basketball/leagues/12.png",
              },
              country: {
                id: 5,
                name: "USA",
                code: "US",
                flag: "https://media.api-sports.io/flags/us.svg",
              },
              games: {
                played: 40,
                win: { total: 32, percentage: "0.800" },
                lose: { total: 8, percentage: "0.200" },
              },
              points: {
                for: 4598,
                against: 4243,
              },
              form: "WWWWW",
              description: "Promotion - NBA Finals",
            },
            {
              position: 2,
              stage: "Regular Season",
              group: {
                name: "Eastern Conference",
                points: null,
              },
              team: {
                id: 141,
                name: "Milwaukee Bucks",
                logo: "https://media.api-sports.io/basketball/teams/141.png",
              },
              league: {
                id: 12,
                name: "NBA",
                type: "League",
                season: "2023-2024",
                logo: "https://media.api-sports.io/basketball/leagues/12.png",
              },
              country: {
                id: 5,
                name: "USA",
                code: "US",
                flag: "https://media.api-sports.io/flags/us.svg",
              },
              games: {
                played: 40,
                win: { total: 28, percentage: "0.700" },
                lose: { total: 12, percentage: "0.300" },
              },
              points: {
                for: 4509,
                against: 4367,
              },
              form: "WLWWW",
              description: "Promotion - NBA Finals",
            },
            {
              position: 3,
              stage: "Regular Season",
              group: {
                name: "Eastern Conference",
                points: null,
              },
              team: {
                id: 146,
                name: "Philadelphia 76ers",
                logo: "https://media.api-sports.io/basketball/teams/146.png",
              },
              league: {
                id: 12,
                name: "NBA",
                type: "League",
                season: "2023-2024",
                logo: "https://media.api-sports.io/basketball/leagues/12.png",
              },
              country: {
                id: 5,
                name: "USA",
                code: "US",
                flag: "https://media.api-sports.io/flags/us.svg",
              },
              games: {
                played: 40,
                win: { total: 26, percentage: "0.650" },
                lose: { total: 14, percentage: "0.350" },
              },
              points: {
                for: 4389,
                against: 4298,
              },
              form: "WWLWW",
              description: "Promotion - NBA Finals",
            },
          ],
          // Western Conference
          [
            {
              position: 1,
              stage: "Regular Season",
              group: {
                name: "Western Conference",
                points: null,
              },
              team: {
                id: 149,
                name: "Los Angeles Lakers",
                logo: "https://media.api-sports.io/basketball/teams/149.png",
              },
              league: {
                id: 12,
                name: "NBA",
                type: "League",
                season: "2023-2024",
                logo: "https://media.api-sports.io/basketball/leagues/12.png",
              },
              country: {
                id: 5,
                name: "USA",
                code: "US",
                flag: "https://media.api-sports.io/flags/us.svg",
              },
              games: {
                played: 40,
                win: { total: 29, percentage: "0.725" },
                lose: { total: 11, percentage: "0.275" },
              },
              points: {
                for: 4572,
                against: 4401,
              },
              form: "WWLWW",
              description: "Promotion - NBA Finals",
            },
            {
              position: 2,
              stage: "Regular Season",
              group: {
                name: "Western Conference",
                points: null,
              },
              team: {
                id: 140,
                name: "Golden State Warriors",
                logo: "https://media.api-sports.io/basketball/teams/140.png",
              },
              league: {
                id: 12,
                name: "NBA",
                type: "League",
                season: "2023-2024",
                logo: "https://media.api-sports.io/basketball/leagues/12.png",
              },
              country: {
                id: 5,
                name: "USA",
                code: "US",
                flag: "https://media.api-sports.io/flags/us.svg",
              },
              games: {
                played: 40,
                win: { total: 27, percentage: "0.675" },
                lose: { total: 13, percentage: "0.325" },
              },
              points: {
                for: 4498,
                against: 4357,
              },
              form: "WWWLW",
              description: "Promotion - NBA Finals",
            },
            {
              position: 3,
              stage: "Regular Season",
              group: {
                name: "Western Conference",
                points: null,
              },
              team: {
                id: 138,
                name: "Denver Nuggets",
                logo: "https://media.api-sports.io/basketball/teams/138.png",
              },
              league: {
                id: 12,
                name: "NBA",
                type: "League",
                season: "2023-2024",
                logo: "https://media.api-sports.io/basketball/leagues/12.png",
              },
              country: {
                id: 5,
                name: "USA",
                code: "US",
                flag: "https://media.api-sports.io/flags/us.svg",
              },
              games: {
                played: 40,
                win: { total: 25, percentage: "0.625" },
                lose: { total: 15, percentage: "0.375" },
              },
              points: {
                for: 4488,
                against: 4421,
              },
              form: "WLWLW",
              description: "Promotion - NBA Finals",
            },
          ],
        ],
      },
    },
  ],
};

export default {
  getNBAStandings: () => MOCK_NBA_STANDINGS,
  // Add more mock data functions as needed
};

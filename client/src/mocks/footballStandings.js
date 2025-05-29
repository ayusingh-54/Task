/**
 * Mock data for football standings
 * Used as fallback when API is unavailable
 */

export const MOCK_PREMIER_LEAGUE_STANDINGS = {
  competition: {
    id: 2021,
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
        {
          position: 4,
          team: {
            id: 61,
            name: "Chelsea FC",
            crest: "https://crests.football-data.org/61.png",
          },
          playedGames: 15,
          won: 9,
          draw: 4,
          lost: 2,
          points: 31,
          goalsFor: 25,
          goalsAgainst: 14,
          goalDifference: 11,
        },
        {
          position: 5,
          team: {
            id: 57,
            name: "Arsenal FC",
            crest: "https://crests.football-data.org/57.png",
          },
          playedGames: 15,
          won: 8,
          draw: 5,
          lost: 2,
          points: 29,
          goalsFor: 24,
          goalsAgainst: 16,
          goalDifference: 8,
        },
      ],
    },
  ],
};

export default {
  getPremierLeague: () => MOCK_PREMIER_LEAGUE_STANDINGS,
  getCompetitionStandings: (code) => {
    if (code === "PL") return MOCK_PREMIER_LEAGUE_STANDINGS;
    return null;
  },
};

/**
 * Mock data for today's matches
 * Used when API endpoint is unavailable
 */

const MOCK_FOOTBALL_MATCHES = {
  matches: [
    {
      id: 419432,
      competition: {
        name: "Premier League",
        code: "PL",
        emblem: "https://crests.football-data.org/PL.png",
      },
      utcDate: new Date().toISOString(),
      status: "SCHEDULED",
      homeTeam: {
        id: 61,
        name: "Chelsea FC",
        shortName: "Chelsea",
        crest: "https://crests.football-data.org/61.png",
      },
      awayTeam: {
        id: 57,
        name: "Arsenal FC",
        shortName: "Arsenal",
        crest: "https://crests.football-data.org/57.png",
      },
      score: { fullTime: { home: null, away: null } },
    },
    {
      id: 419433,
      competition: {
        name: "Premier League",
        code: "PL",
        emblem: "https://crests.football-data.org/PL.png",
      },
      utcDate: new Date().toISOString(),
      status: "SCHEDULED",
      homeTeam: {
        id: 64,
        name: "Liverpool FC",
        shortName: "Liverpool",
        crest: "https://crests.football-data.org/64.png",
      },
      awayTeam: {
        id: 65,
        name: "Manchester City FC",
        shortName: "Man City",
        crest: "https://crests.football-data.org/65.png",
      },
      score: { fullTime: { home: null, away: null } },
    },
    {
      id: 419434,
      competition: {
        name: "La Liga",
        code: "PD",
        emblem: "https://crests.football-data.org/PD.png",
      },
      utcDate: new Date().toISOString(),
      status: "SCHEDULED",
      homeTeam: {
        id: 86,
        name: "Real Madrid CF",
        shortName: "Real Madrid",
        crest: "https://crests.football-data.org/86.png",
      },
      awayTeam: {
        id: 81,
        name: "FC Barcelona",
        shortName: "Barcelona",
        crest: "https://crests.football-data.org/81.png",
      },
      score: { fullTime: { home: null, away: null } },
    },
  ],
};

const MOCK_BASKETBALL_MATCHES = {
  response: [
    {
      id: 8213,
      date: new Date().toISOString(),
      time: "20:00",
      status: { long: "Scheduled", short: "NS" },
      teams: {
        home: {
          id: 139,
          name: "Boston Celtics",
          logo: "https://media.api-sports.io/basketball/teams/139.png",
        },
        away: {
          id: 134,
          name: "Los Angeles Lakers",
          logo: "https://media.api-sports.io/basketball/teams/134.png",
        },
      },
      scores: { home: { total: null }, away: { total: null } },
      league: {
        name: "NBA",
        logo: "https://media.api-sports.io/basketball/leagues/12.png",
      },
    },
    {
      id: 8214,
      date: new Date().toISOString(),
      time: "19:30",
      status: { long: "Scheduled", short: "NS" },
      teams: {
        home: {
          id: 141,
          name: "Milwaukee Bucks",
          logo: "https://media.api-sports.io/basketball/teams/141.png",
        },
        away: {
          id: 133,
          name: "Brooklyn Nets",
          logo: "https://media.api-sports.io/basketball/teams/133.png",
        },
      },
      scores: { home: { total: null }, away: { total: null } },
      league: {
        name: "NBA",
        logo: "https://media.api-sports.io/basketball/leagues/12.png",
      },
    },
    {
      id: 8215,
      date: new Date().toISOString(),
      time: "21:00",
      status: { long: "Scheduled", short: "NS" },
      teams: {
        home: {
          id: 138,
          name: "Denver Nuggets",
          logo: "https://media.api-sports.io/basketball/teams/138.png",
        },
        away: {
          id: 149,
          name: "Phoenix Suns",
          logo: "https://media.api-sports.io/basketball/teams/149.png",
        },
      },
      scores: { home: { total: null }, away: { total: null } },
      league: {
        name: "NBA",
        logo: "https://media.api-sports.io/basketball/leagues/12.png",
      },
    },
  ],
};

export default {
  getFootballMatches: () => MOCK_FOOTBALL_MATCHES,
  getBasketballMatches: () => MOCK_BASKETBALL_MATCHES,
};

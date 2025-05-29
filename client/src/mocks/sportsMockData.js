/**
 * Mock data for sports APIs
 * Used when real API is unavailable
 */

// Mock today's matches for both football and basketball
export const todaysMatches = {
  football: {
    matches: [
      {
        id: 419432,
        competition: { name: "Premier League", code: "PL", emblem: "https://crests.football-data.org/PL.png" },
        utcDate: new Date().toISOString(),
        status: "SCHEDULED",
        homeTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea", crest: "https://crests.football-data.org/61.png" },
        awayTeam: { id: 57, name: "Arsenal FC", shortName: "Arsenal", crest: "https://crests.football-data.org/57.png" },
        score: { fullTime: { home: null, away: null } }
      },
      {
        id: 419433,
        competition: { name: "Premier League", code: "PL", emblem: "https://crests.football-data.org/PL.png" },
        utcDate: new Date().toISOString(),
        status: "SCHEDULED",
        homeTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool", crest: "https://crests.football-data.org/64.png" },
        awayTeam: { id: 65, name: "Manchester City FC", shortName: "Man City", crest: "https://crests.football-data.org/65.png" },
        score: { fullTime: { home: null, away: null } }
      }
    ]
  },
  basketball: {
    response: [
      {
        id: 8213,
        date: new Date().toISOString(),
        time: "20:00",
        status: { long: "Scheduled", short: "NS" },
        teams: {
          home: { id: 139, name: "Boston Celtics", logo: "https://media.api-sports.io/basketball/teams/139.png" },
          away: { id: 134, name: "Los Angeles Lakers", logo: "https://media.api-sports.io/basketball/teams/134.png" }
        },
        scores: { home: { total: null }, away: { total: null } }
      },
      {
        id: 8214,
        date: new Date().toISOString(),
        time: "19:30",
        status: { long: "Scheduled", short: "NS" },
        teams: {
          home: { id: 141, name: "Milwaukee Bucks", logo: "https://media.api-sports.io/basketball/teams/141.png" },
          away: { id: 133, name: "Brooklyn Nets", logo: "https://media.api-sports.io/basketball/teams/133.png" }
        },
        scores: { home: { total: null }, away: { total: null } }
      }
    ]
  }
};

// Mock standings data
export const standings = {
  football: {
    PL: {
      competition: { name: "Premier League", code: "PL", emblem: "https://crests.football-data.org/PL.png" },
      standings: [{
        table: [
          { position: 1, team: { id: 64, name: "Liverpool FC", crest: "https://crests.football-data.org/64.png" }, playedGames: 38, won: 28, draw: 8, lost: 2, points: 92, goalDifference: 52 },
          { position: 2, team: { id: 65, name: "Manchester City FC", crest: "https://crests.football-data.org/65.png" }, playedGames: 38, won: 27, draw: 6, lost: 5, points: 87, goalDifference: 48 },
          { position: 3, team: { id: 66, name: "Manchester United FC", crest: "https://crests.football-data.org/66.png" }, playedGames: 38, won: 22, draw: 10, lost: 6, points: 76, goalDifference: 37 }
        ]
      }]
    }
  },
  basketball: {
    NBA: {
      response: [{
        league: {
          id: 12,
          name: "NBA",
          season: "2023-2024",
          logo: "https://media.api-sports.io/basketball/leagues/12.png",
          standings: [
            // Eastern Conference
            [
              {
                position: 1,
                group: { name: "Eastern Conference" },
                team: { id: 139, name: "Boston Celtics", logo: "https://media.api-sports.io/basketball/teams/139.png" },
                games: { played: 82, win: { total: 64, percentage: "0.780" }, lose: { total: 18, percentage: "0.220" } }
              },
              {
                position: 2,
                group: { name: "Eastern Conference" },
                team: { id: 141, name: "Milwaukee Bucks", logo: "https://media.api-sports.io/basketball/teams/141.png" },
                games: { played: 82, win: { total: 58, percentage: "0.707" }, lose: { total: 24, percentage: "0.293" } }
              }
            ],
            // Western Conference
            [
              {
                position: 1,
                group: { name: "Western Conference" },
                team: { id: 138, name: "Denver Nuggets", logo: "https://media.api-sports.io/basketball/teams/138.png" },
                games: { played: 82, win: { total: 57, percentage: "0.695" }, lose: { total: 25, percentage: "0.305" } }
              },
              {
                position: 2,
                group: { name: "Western Conference" },
                team: { id: 149, name: "Phoenix Suns", logo: "https://media.api-sports.io/basketball/teams/149.png" },
                games: { played: 82, win: { total: 54, percentage: "0.659" }, lose: { total: 28, percentage: "0.341" } }
              }
            ]
          ]
        }
      }]
    }
  }
};

export default {
  todaysMatches,
  standings,
  
  // Helper function to get today's matches with proper sport type
  getTodaysMatches: (sport) => {
    return sport === 'basketball' ? todaysMatches.basketball : todaysMatches.football;
  },
  
  // Helper function to get standings with proper competition code
  getStandings: (sport, competitionCode) => {
    if (sport === 'basketball') {
      return competitionCode === '12' ? standings.basketball.NBA : null;
    } else {
      return standings.football[competitionCode] || standings.football.PL;
    }
  }
};

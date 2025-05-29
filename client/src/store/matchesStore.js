import { create } from "zustand";
import matchesService from "../services/matchesService";
import { SPORTS } from "../services/apiHelper";

// Helper to determine if data is from api-basketball (has 'response' array)
const isApiBasketballData = (data) => data && Array.isArray(data.response);
const getSportTypeFromEnv = () =>
  process.env.REACT_APP_SPORT_TYPE || "football"; // Assuming you might set this in client .env

const useMatchesStore = create((set, get) => ({
  matches: [], // For general upcoming matches (e.g., default competition)
  previousMatches: [], // New state for previous matches
  currentMatch: null,
  loading: false,
  error: null,
  todaysMatches: [], // New state for today's matches
  competitionMatches: [], // New state for specific competition matches
  standings: null, // New state for competition standings
  scorers: [], // New state for competition scorers

  // Fetch all upcoming matches (e.g., for a default competition like PL)
  fetchMatches: async () => {
    set({ loading: true, error: null });
    try {
      const data = await matchesService.getUpcomingMatches();
      // Adapt based on API: football-data.org has 'matches', api-basketball has 'response'
      const matchesList = isApiBasketballData(data)
        ? data.response
        : data.matches || data.data || [];

      set({ matches: matchesList, loading: false });
    } catch (error) {
      console.error("Failed to fetch matches:", error);
      set({
        error: "Failed to load matches. Please try again later.",
        loading: false,
      });
    }
  },

  // Fetch match details by ID
  fetchMatchById: async (matchId) => {
    if (!matchId) return;

    set({ loading: true, error: null });
    try {
      const data = await matchesService.getMatchById(matchId);
      // football-data.org: { match: {} } or {}, api-basketball: { response: [{}] }
      const matchDetail = isApiBasketballData(data)
        ? data.response?.[0] || {}
        : data.match || data || {};

      set({ currentMatch: matchDetail, loading: false });
    } catch (error) {
      console.error(`Failed to fetch match with ID ${matchId}:`, error);
      set({
        error: "Failed to load match details. Please try again later.",
        loading: false,
      });
    }
  },

  // Clear current match data (useful when navigating away from details page)
  clearCurrentMatch: () => {
    set({ currentMatch: null });
  },

  // NEW V4 Actions

  // Fetch today's matches
  fetchTodaysMatches: async () => {
    set({ loading: true, error: null });
    try {
      const data = await matchesService.getTodaysMatches();
      const matchesList = isApiBasketballData(data)
        ? data.response
        : data.matches || data.data || [];
      set({ todaysMatches: matchesList, loading: false });
    } catch (error) {
      console.error("Failed to fetch today's matches:", error);
      set({
        error: "Failed to load today's matches. Please try again later.",
        loading: false,
      });
    }
  },

  // Fetch matches for a specific competition/league
  fetchCompetitionMatches: async (competitionCodeOrLeagueId, season) => {
    set({ loading: true, error: null });
    try {
      const data = await matchesService.getCompetitionMatches(
        competitionCodeOrLeagueId,
        season
      );
      const matchesList = isApiBasketballData(data)
        ? data.response
        : data.matches || data.data || [];
      set({ competitionMatches: matchesList, loading: false });
    } catch (error) {
      console.error(
        `Failed to fetch matches for ${competitionCodeOrLeagueId}:`,
        error
      );
      set({
        error: `Failed to load matches for ${competitionCodeOrLeagueId}. Please try again later.`,
        loading: false,
      });
    }
  },

  // Fetch standings for a specific competition/league
  fetchCompetitionStandings: async (competitionCodeOrLeagueId, season) => {
    set({ loading: true, error: null });
    try {
      const data = await matchesService.getCompetitionStandings(
        competitionCodeOrLeagueId,
        season
      );
      // api-basketball standings: { response: [ { league: { standings: [[]] } } ] }
      // football-data standings: { standings: [{ table: [] }] }
      // The raw data is stored; parsing happens in the component.
      set({ standings: data, loading: false });
    } catch (error) {
      console.error(
        `Failed to fetch standings for ${competitionCodeOrLeagueId}:`,
        error
      );
      set({
        error: `Failed to load standings for ${competitionCodeOrLeagueId}. Please try again later.`,
        loading: false,
      });
    }
  },

  // Fetch scorers for a specific competition/league
  fetchCompetitionScorers: async (competitionCodeOrLeagueId, season) => {
    set({ loading: true, error: null });
    try {
      const data = await matchesService.getCompetitionScorers(
        competitionCodeOrLeagueId,
        season
      );
      const scorersList = isApiBasketballData(data)
        ? data.response
        : data.scorers || data.data || [];
      set({ scorers: scorersList, loading: false });
    } catch (error) {
      console.error(
        `Failed to fetch scorers for ${competitionCodeOrLeagueId}:`,
        error
      );
      set({
        error: `Failed to load scorers for ${competitionCodeOrLeagueId}. Please try again later.`,
        loading: false,
      });
    }
  },

  // Fetch previous matches
  fetchPreviousMatches: async (sport = SPORTS.FOOTBALL) => {
    set({ loading: true, error: null });
    try {
      const data = await matchesService.getPreviousMatches(sport);
      const matchesList = isApiBasketballData(data)
        ? data.response
        : data.matches || data.data || [];
      set({ previousMatches: matchesList, loading: false });
    } catch (error) {
      console.error(`Failed to fetch previous matches:`, error);
      set({
        error: "Failed to load previous matches. Please try again later.",
        loading: false,
      });
    }
  },
}));

export default useMatchesStore;

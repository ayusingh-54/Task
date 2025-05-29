import { create } from "zustand";
import cricketService from "../services/cricketService";

const useCricketStore = create((set, get) => ({
  matches: [],
  previousMatches: [],
  currentMatch: null,
  scorecard: null,
  commentary: null,
  overDetails: null,
  series: [],
  news: [],
  loading: false,
  error: null,

  // Fetch all upcoming cricket matches
  fetchMatches: async () => {
    set({ loading: true, error: null });
    try {
      const data = await cricketService.getMatches();
      const matchesList = data.matches || [];
      set({ matches: matchesList, loading: false });
    } catch (error) {
      console.error("Failed to fetch cricket matches:", error);
      set({
        error: "Failed to load cricket matches. Please try again later.",
        loading: false,
      });
    }
  },

  // Fetch previous cricket matches
  fetchPreviousMatches: async () => {
    set({ loading: true, error: null });
    try {
      const data = await cricketService.getPreviousMatches();
      const matchesList = data.matches || [];
      set({ previousMatches: matchesList, loading: false });
    } catch (error) {
      console.error("Failed to fetch previous cricket matches:", error);
      set({
        error:
          "Failed to load previous cricket matches. Please try again later.",
        loading: false,
      });
    }
  },

  // Fetch cricket match details by ID
  fetchMatchById: async (matchId) => {
    if (!matchId) return;

    set({ loading: true, error: null });
    try {
      const matchDetail = await cricketService.getMatchById(matchId);
      set({ currentMatch: matchDetail, loading: false });
    } catch (error) {
      console.error(`Failed to fetch cricket match with ID ${matchId}:`, error);
      set({
        error: "Failed to load cricket match details. Please try again later.",
        loading: false,
      });
    }
  },

  // Fetch cricket match scorecard
  fetchMatchScorecard: async (matchId) => {
    if (!matchId) return;

    set({ loading: true, error: null });
    try {
      const scorecard = await cricketService.getMatchScorecard(matchId);
      set({ scorecard, loading: false });
    } catch (error) {
      console.error(
        `Failed to fetch cricket scorecard for match ${matchId}:`,
        error
      );
      set({
        error: "Failed to load cricket scorecard. Please try again later.",
        loading: false,
      });
    }
  },

  // Fetch cricket match commentary
  fetchMatchCommentary: async (matchId) => {
    if (!matchId) return;

    set({ loading: true, error: null });
    try {
      const commentary = await cricketService.getMatchCommentary(matchId);
      set({ commentary, loading: false });
    } catch (error) {
      console.error(
        `Failed to fetch cricket commentary for match ${matchId}:`,
        error
      );
      set({
        error: "Failed to load cricket commentary. Please try again later.",
        loading: false,
      });
    }
  },

  // Fetch cricket series list
  fetchSeriesList: async () => {
    set({ loading: true, error: null });
    try {
      const data = await cricketService.getSeriesList();
      const seriesList = data.seriesList || [];
      set({ series: seriesList, loading: false });
    } catch (error) {
      console.error("Failed to fetch cricket series:", error);
      set({
        error: "Failed to load cricket series. Please try again later.",
        loading: false,
      });
    }
  },

  // Fetch cricket news
  fetchNewsList: async () => {
    set({ loading: true, error: null });
    try {
      const data = await cricketService.getNewsList();
      const newsList = data.newsList || [];
      set({ news: newsList, loading: false });
    } catch (error) {
      console.error("Failed to fetch cricket news:", error);
      set({
        error: "Failed to load cricket news. Please try again later.",
        loading: false,
      });
    }
  },

  // Fetch IPL cricket matches
  fetchIplMatches: async () => {
    set({ loading: true, error: null });
    try {
      const data = await cricketService.getIplMatches();
      const matchesList = data.matches || [];
      set({ matches: matchesList, loading: false });
    } catch (error) {
      console.error("Failed to fetch IPL cricket matches:", error);
      set({
        error: "Failed to load IPL cricket matches. Please try again later.",
        loading: false,
      });
    }
  },

  // Fetch cricket match overs
  fetchMatchOvers: async (matchId) => {
    if (!matchId) return;
    set({ loading: true, error: null });
    try {
      const data = await cricketService.getMatchOvers(matchId);
      set({ overDetails: data.overs || [], loading: false });
    } catch (error) {
      console.error(
        `Failed to fetch cricket match overs for ${matchId}:`,
        error
      );
      set({
        overDetails: [],
        loading: false,
      });
    }
  },

  // Clear current match data
  clearCurrentMatch: () => {
    set({
      currentMatch: null,
      scorecard: null,
      commentary: null,
      overDetails: null,
    });
  },
}));

export default useCricketStore;

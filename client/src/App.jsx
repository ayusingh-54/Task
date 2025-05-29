import { Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "./contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import MatchesPage from "./pages/MatchesPage"; // Keeping this as a fallback
import MatchDetailsPage from "./pages/MatchDetailsPage";
import TodaysMatchesPage from "./pages/TodaysMatchesPage"; // Keeping this as a fallback
import CompetitionStandingsPage from "./pages/CompetitionStandingsPage"; // Keeping this as a fallback

// Sport-specific pages
import FootballMatchesPage from "./pages/football/FootballMatchesPage";
import BasketballMatchesPage from "./pages/basketball/BasketballMatchesPage";
import FootballTodaysMatchesPage from "./pages/football/FootballTodaysMatchesPage";
import BasketballTodaysMatchesPage from "./pages/basketball/BasketballTodaysMatchesPage";
import FootballStandingsPage from "./pages/football/FootballStandingsPage";
import BasketballStandingsPage from "./pages/basketball/BasketballStandingsPage";
import CricketMatchesPage from "./pages/cricket/CricketMatchesPage";
import CricketMatchDetailsPage from "./pages/cricket/CricketMatchDetailsPage";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function App() {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Home route */}
            <Route path="/" element={<HomePage />} />

            {/* Legacy routes - could redirect to new sport-specific routes */}
            <Route
              path="/matches"
              element={<Navigate to="/football/matches" replace />}
            />
            <Route
              path="/matches/today"
              element={<Navigate to="/football/today" replace />}
            />
            <Route
              path="/standings"
              element={<Navigate to="/football/standings/PL" replace />}
            />
            <Route
              path="/standings/:competitionCode"
              element={
                <Navigate
                  to={(params) =>
                    `/football/standings/${params.competitionCode}`
                  }
                  replace
                />
              }
            />

            {/* Match details route - shared between sports */}
            <Route path="/matches/:id" element={<MatchDetailsPage />} />

            {/* Football-specific routes */}
            <Route path="/football/matches" element={<FootballMatchesPage />} />
            <Route
              path="/football/today"
              element={<FootballTodaysMatchesPage />}
            />
            <Route
              path="/football/standings/:competitionCode"
              element={<FootballStandingsPage />}
            />
            <Route
              path="/football/standings"
              element={<FootballStandingsPage />}
            />

            {/* Basketball-specific routes */}
            <Route
              path="/basketball/matches"
              element={<BasketballMatchesPage />}
            />
            <Route
              path="/basketball/today"
              element={<BasketballTodaysMatchesPage />}
            />
            <Route
              path="/basketball/standings/:competitionCode"
              element={<BasketballStandingsPage />}
            />
            <Route
              path="/basketball/standings"
              element={<BasketballStandingsPage />}
            />

            {/* Cricket-specific routes */}
            <Route path="/cricket/matches" element={<CricketMatchesPage />} />
            <Route
              path="/cricket/matches/:id"
              element={<CricketMatchDetailsPage />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;

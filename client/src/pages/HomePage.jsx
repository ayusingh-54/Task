import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const HomePage = () => {
  const { darkMode } = useTheme();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary-light to-blue-400 dark:from-primary-dark dark:to-blue-800 text-white rounded-lg shadow-xl">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Live Sports Match Tracker
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Stay updated with the latest scores, schedules, and statistics for
            your favorite sports teams.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/football/today"
              className="btn inline-block px-8 py-3 text-lg font-semibold bg-white text-primary-dark hover:bg-gray-100 rounded-full transition-colors duration-300"
            >
              Football Matches
            </Link>
            <Link
              to="/basketball/today"
              className="btn inline-block px-8 py-3 text-lg font-semibold bg-yellow-500 text-white hover:bg-yellow-600 rounded-full transition-colors duration-300"
            >
              Basketball Games
            </Link>
            {/* <Link
              to="/cricket/matches"
              className="btn inline-block px-8 py-3 text-lg font-semibold bg-green-500 text-white hover:bg-green-600 rounded-full transition-colors duration-300"
            >
              Cricket Matches
            </Link> */}
          </div>
        </div>
      </section>
      {/* Quick Navigation */}
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/football/standings/PL"
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">⚽</span>
                </div>
                <h3 className="font-semibold">Premier League</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Standings
                </p>
              </div>
            </Link>

            <Link
              to="/basketball/standings/12"
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🏀</span>
                </div>
                <h3 className="font-semibold">NBA</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Standings
                </p>
              </div>
            </Link>

            <Link
              to="/football//today"
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📅</span>
                </div>
                <h3 className="font-semibold">All Football</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Matches
                </p>
              </div>
            </Link>

            <Link
              to="/basketball//today"
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📊</span>
                </div>
                <h3 className="font-semibold">All Basketball</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Games
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>{" "}
      {/* Status Notice */}
      <section className="w-full py-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
              Demo Mode Active
            </h3>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 max-w-2xl mx-auto">
            The app is currently running with sample data for demonstration
            purposes. This provides a consistent experience while showcasing the
            application's features.
          </p>
          <div className="mt-4 text-sm text-yellow-600 dark:text-yellow-400">
            To use live data: Set{" "}
            <code className="bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded">
              VITE_USE_MOCK_DATA=false
            </code>{" "}
            in client/.env
          </div>
        </div>
      </section>
      {/* Featured Match Section */}
      <section className="w-full py-16 bg-gray-100 dark:bg-gray-800 rounded-lg mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Match
          </h2>

          <div className="max-w-4xl mx-auto card p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h3 className="text-2xl font-bold">Boston Celtics</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  East Conference
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold">VS</span>
              </div>

              <div className="text-center md:text-right">
                <h3 className="text-2xl font-bold">LA Lakers</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  West Conference
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-lg">December 25, 2023 • 8:00 PM ET</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Staples Center, Los Angeles
              </p>

              <Link
                to="/matches/1" // Changed from "featured" to use a valid match ID
                className="btn btn-primary mt-6 inline-block"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

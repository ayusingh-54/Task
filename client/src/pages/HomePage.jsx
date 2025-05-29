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
          <Link
            to="/matches"
            className="btn inline-block px-8 py-3 text-lg font-semibold bg-white text-primary-dark hover:bg-gray-100 rounded-full transition-colors duration-300"
          >
            View Upcoming Matches
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Use Our Match Tracker?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-light dark:bg-primary-dark rounded-full text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get live scores and match events as they happen.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-light dark:bg-primary-dark rounded-full text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Detailed Statistics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dive deep into match statistics and player performance.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-light dark:bg-primary-dark rounded-full text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Match Schedule</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Never miss a game with our comprehensive match calendar.
              </p>
            </div>
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

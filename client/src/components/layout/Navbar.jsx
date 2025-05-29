import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import SportSelector from "./SportSelector";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  // Determine which sport's navigation to show
  const isBasketball = location.pathname.includes("/basketball");
  const sportPrefix = isBasketball ? "/basketball" : "/football";

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
            <Link
              to="/"
              className="text-xl font-bold text-primary-light dark:text-primary-dark"
            >
              Match Tracker
            </Link>
            <div className="md:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="mb-4 md:mb-0">
            <SportSelector />
          </div>

          <div className="flex items-center flex-wrap justify-center space-x-2 md:space-x-4">
            <Link
              to="/"
              className="font-medium hover:text-primary-light dark:hover:text-primary-dark transition-colors px-2 py-1"
            >
              Home
            </Link>
            {/* <Link
              to={`${sportPrefix}/matches`}
              className="font-medium hover:text-primary-light dark:hover:text-primary-dark transition-colors px-2 py-1"
            >
              Matches
            </Link> */}
            <Link
              to={`${sportPrefix}/today`}
              className="font-medium hover:text-primary-light dark:hover:text-primary-dark transition-colors px-2 py-1"
            >
              Today's
            </Link>
            <Link
              to={
                isBasketball
                  ? `${sportPrefix}/standings/12?season=2023-2024`
                  : `${sportPrefix}/standings/PL`
              }
              className="font-medium hover:text-primary-light dark:hover:text-primary-dark transition-colors px-2 py-1"
            >
              Standings
            </Link>

            <div className="hidden md:block">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

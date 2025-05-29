import { useEffect, useState } from "react";
import useMatchesStore from "../../store/matchesStore";
import MatchCard from "../../components/matches/MatchCard";
import { SPORTS } from "../../services/apiHelper";

const BasketballMatchesPage = () => {
  const {
    matches,
    previousMatches,
    loading,
    error,
    fetchMatches,
    fetchPreviousMatches,
  } = useMatchesStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' or 'previous'
  const matchesPerPage = 9;

  useEffect(() => {
    // Fetch both upcoming and previous matches on component mount
    fetchMatches(SPORTS.BASKETBALL);
    fetchPreviousMatches(SPORTS.BASKETBALL);
  }, [fetchMatches, fetchPreviousMatches]);

  // Get the correct matches array based on active tab
  const currentTabMatches =
    activeTab === "upcoming" ? matches : previousMatches;

  // Pagination logic
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = currentTabMatches.slice(
    indexOfFirstMatch,
    indexOfLastMatch
  );
  const totalPages = Math.ceil(currentTabMatches.length / matchesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  if (loading && currentMatches.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-center">Basketball Games</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
        Latest basketball games from leagues around the world
      </p>

      {/* Tab navigation */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {/* <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              activeTab === "upcoming"
                ? "bg-primary-light dark:bg-primary-dark text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            } border border-gray-200 dark:border-gray-600`}
            onClick={() => handleTabChange("upcoming")}
          >
            Upcoming Games
          </button> */}
          {/* <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              activeTab === "previous"
                ? "bg-primary-light dark:bg-primary-dark text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            } border border-gray-200 dark:border-gray-600`}
            onClick={() => handleTabChange("previous")}
          >
            Previous Games
          </button> */}
        </div>
      </div>

      {error && (
        <div className="text-center p-4 mb-4 bg-red-100 dark:bg-red-900 rounded-lg">
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}

      {currentMatches.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xl">
            {activeTab === "upcoming"
              ? "No upcoming basketball games found. Check previous games."
              : "No previous basketball games found. Check upcoming games."}
          </p>
          {activeTab === "upcoming" && previousMatches.length > 0 && (
            <button
              onClick={() => handleTabChange("previous")}
              className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700"
            >
              View Previous Games
            </button>
          )}
          {activeTab === "previous" && matches.length > 0 && (
            <button
              onClick={() => handleTabChange("upcoming")}
              className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700"
            >
              View Upcoming Games
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? "bg-primary-light dark:bg-primary-dark text-white"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BasketballMatchesPage;

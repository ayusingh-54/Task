import { useEffect, useState } from "react";
import useCricketStore from "../../store/cricketStore";
import CricketMatchCard from "../../components/cricket/CricketMatchCard";

const CricketMatchesPage = () => {
  const { matches, loading, error, fetchMatches } = useCricketStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("live"); // 'live' or 'ipl'
  const matchesPerPage = 6;

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Filter matches based on tab
  const filterMatches = () => {
    if (!matches) return [];

    return matches.filter((match) => {
      const matchInfo = match.matchInfo || match;
      const state = (matchInfo.state || "").toLowerCase();
      const seriesName = (matchInfo.seriesName || "").toLowerCase();
      const now = new Date();

      // For IPL tab - only show IPL matches
      if (activeTab === "ipl") {
        return seriesName.includes("ipl") && matchInfo.startDate;
      }

      // For live tab, show all other matches
      return true;
    });
  };

  const filteredMatches = filterMatches();

  // Pagination logic
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = filteredMatches.slice(
    indexOfFirstMatch,
    indexOfLastMatch
  );
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  if (loading && matches.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-center">Cricket</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
        {activeTab === "ipl"
          ? "IPL (Indian Premier League) cricket matches"
          : "Cricket matches from around the world"}
      </p>

      {/* Tab navigation - Simplified to just Live and IPL */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "live"
                ? "bg-red-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            } border border-gray-200 dark:border-gray-600 rounded-l-lg`}
            onClick={() => handleTabChange("live")}
          >
            Live
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "ipl"
                ? "bg-yellow-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            } border border-gray-200 dark:border-gray-600 rounded-r-lg`}
            onClick={() => handleTabChange("ipl")}
          >
            IPL
          </button>
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
            {activeTab === "live"
              ? "No cricket matches found."
              : "No IPL matches found. The tournament might not be in season."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {activeTab !== "live" && (
              <button
                onClick={() => handleTabChange("live")}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                View All Matches
              </button>
            )}
            {activeTab !== "ipl" && (
              <button
                onClick={() => handleTabChange("ipl")}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                View IPL Matches
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMatches.map((match) => (
              <CricketMatchCard
                key={match.matchInfo?.matchId || match.id}
                match={match}
              />
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

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNum
                          ? "bg-primary-light dark:bg-primary-dark text-white"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

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

export default CricketMatchesPage;

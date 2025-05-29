import { useEffect, useState } from "react";
import useMatchesStore from "../store/matchesStore";
import MatchCard from "../components/matches/MatchCard";

const MatchesPage = () => {
  const { matches, loading, error, fetchMatches } = useMatchesStore();
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 10;

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Pagination logic
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);
  const totalPages = Math.ceil(matches.length / matchesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 dark:bg-red-900 rounded-lg">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-300 mb-2">
          Error
        </h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Upcoming Matches</h1>

      {matches.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xl">No upcoming matches found.</p>
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

export default MatchesPage;

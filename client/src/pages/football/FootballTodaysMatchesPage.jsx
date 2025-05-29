import { useEffect, useState } from "react";
import useMatchesStore from "../../store/matchesStore";
import MatchCard from "../../components/matches/MatchCard";
import { Link } from "react-router-dom";
import { SPORTS } from "../../services/apiHelper";

const FootballTodaysMatchesPage = () => {
  const { todaysMatches, loading, error, fetchTodaysMatches } =
    useMatchesStore();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Pass the sport type to ensure we get football matches
    fetchTodaysMatches(SPORTS.FOOTBALL);
  }, [fetchTodaysMatches, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (loading && todaysMatches.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-center">
        Today's Football Matches
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Live and upcoming football matches scheduled for today
      </p>

      {error && (
        <div className="text-center p-4 mb-4 bg-red-100 dark:bg-red-900 rounded-lg">
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-3 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md"
          >
            Retry
          </button>
        </div>
      )}

      {todaysMatches.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xl">No football matches scheduled for today.</p>
          <Link
            to="/football/matches"
            className="btn btn-primary mt-4 inline-block"
          >
            View All Football Matches
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysMatches.map((match) => (
            <MatchCard
              key={match.id || Math.random().toString()}
              match={match}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FootballTodaysMatchesPage;

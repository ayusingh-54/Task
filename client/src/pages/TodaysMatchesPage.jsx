import { useEffect } from "react";
import useMatchesStore from "../store/matchesStore";
import MatchCard from "../components/matches/MatchCard";
import { Link } from "react-router-dom";

const TodaysMatchesPage = () => {
  const { todaysMatches, loading, error, fetchTodaysMatches } =
    useMatchesStore();

  useEffect(() => {
    fetchTodaysMatches();
  }, [fetchTodaysMatches]);

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
        <Link to="/" className="btn btn-primary mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Today's Matches</h1>
      {todaysMatches.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xl">No matches scheduled for today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodaysMatchesPage;

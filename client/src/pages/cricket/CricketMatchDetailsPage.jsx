import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useCricketStore from "../../store/cricketStore";
import { format } from "date-fns";

const CricketMatchDetailsPage = () => {
  const { id } = useParams();
  const {
    currentMatch,
    scorecard,
    commentary,
    loading,
    error,
    fetchMatchById,
    fetchMatchScorecard,
    fetchMatchCommentary,
    overDetails,
    fetchMatchOvers,
    clearCurrentMatch,
  } = useCricketStore();

  // Simplified to just include essential tabs
  const [activeTab, setActiveTab] = useState("info"); // 'info', 'scorecard', or 'commentary'

  useEffect(() => {
    // Fetch match data when component mounts or ID changes
    fetchMatchById(id);
    fetchMatchScorecard(id);
    fetchMatchCommentary(id);
    fetchMatchOvers(id);

    // Set up polling for live matches - update every 30 seconds
    const matchState =
      currentMatch?.matchInfo?.state || currentMatch?.state || "";
    const isLiveMatch =
      matchState.toLowerCase().includes("progress") ||
      matchState.toLowerCase().includes("live");

    let pollingInterval;
    if (isLiveMatch) {
      pollingInterval = setInterval(() => {
        fetchMatchScorecard(id);
        fetchMatchCommentary(id);
        fetchMatchOvers(id);
      }, 30000); // 30 seconds
    }

    return () => {
      clearCurrentMatch();
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [
    id,
    fetchMatchById,
    fetchMatchScorecard,
    fetchMatchCommentary,
    fetchMatchOvers,
    clearCurrentMatch,
    currentMatch,
  ]);

  if (loading && !currentMatch) {
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
        <Link
          to="/cricket/matches"
          className="btn btn-primary mt-4 inline-block"
        >
          Back to Cricket Matches
        </Link>
      </div>
    );
  }

  if (!currentMatch) {
    return (
      <div className="text-center p-8">
        <p>Cricket match not found.</p>
        <Link
          to="/cricket/matches"
          className="btn btn-primary mt-4 inline-block"
        >
          Back to Cricket Matches
        </Link>
      </div>
    );
  }

  // Extract match info
  const matchInfo = currentMatch.matchInfo || currentMatch;
  const matchScore = currentMatch.matchScore || scorecard || {};

  // Get team details
  const team1 = matchInfo.team1 || {};
  const team2 = matchInfo.team2 || {};
  const team1Score = matchScore.team1Score?.inngs1 || {};
  const team2Score = matchScore.team2Score?.inngs1 || {};

  // Format match date
  const formatMatchDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "PPP"); // Example: 'April 29, 2023'
    } catch (error) {
      return dateString || "Date not available";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/cricket/matches"
        className="inline-block mb-6 text-primary-light dark:text-primary-dark hover:underline"
      >
        ← Back to Cricket
      </Link>

      <div className="card p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            {matchInfo.team1?.teamName} vs {matchInfo.team2?.teamName}
          </h1>
          <span
            className={`text-sm font-bold px-3 py-1 rounded-full ${
              (matchInfo.state || "").toLowerCase().includes("progress")
                ? "bg-red-500 text-white"
                : (matchInfo.state || "").toLowerCase().includes("complete")
                ? "bg-gray-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {matchInfo.status || matchInfo.state || "Upcoming"}
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            {matchInfo.seriesName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {matchInfo.matchDesc} • {formatMatchDate(matchInfo.startDate)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {matchInfo.venueInfo?.ground}, {matchInfo.venueInfo?.city}
          </p>
        </div>

        {/* Score summary */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold">
                {team1.teamName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {team1.teamSName}
              </p>
              {team1Score.runs !== undefined ? (
                <p className="text-3xl md:text-5xl font-bold mt-4">
                  {team1Score.runs}/{team1Score.wickets}
                </p>
              ) : (
                <p className="text-3xl md:text-5xl font-bold mt-4">-</p>
              )}
              {team1Score.overs && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ({team1Score.overs} overs)
                </p>
              )}
            </div>

            <div className="text-center mb-6 md:mb-0">
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-primary-light dark:bg-primary-dark rounded-full text-white mx-auto">
                <span className="text-xl md:text-2xl font-bold">VS</span>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold">
                {team2.teamName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {team2.teamSName}
              </p>
              {team2Score.runs !== undefined ? (
                <p className="text-3xl md:text-5xl font-bold mt-4">
                  {team2Score.runs}/{team2Score.wickets}
                </p>
              ) : (
                <p className="text-3xl md:text-5xl font-bold mt-4">-</p>
              )}
              {team2Score.overs && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ({team2Score.overs} overs)
                </p>
              )}
            </div>
          </div>

          {matchInfo.status && (
            <div className="text-center mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {matchInfo.status}
              </p>
              {matchInfo.seriesName && matchInfo.seriesName.includes("IPL") && (
                <p className="mt-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                  IPL Match
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tab navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "info"
                  ? "border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
              }`}
            >
              Match Info
            </button>
            <button
              onClick={() => setActiveTab("scorecard")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "scorecard"
                  ? "border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
              }`}
            >
              Scorecard
            </button>
            <button
              onClick={() => setActiveTab("commentary")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "commentary"
                  ? "border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
              }`}
            >
              Commentary
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {activeTab === "info" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Match Information</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Series</h4>
                  <p>{matchInfo.seriesName}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Match</h4>
                  <p>{matchInfo.matchDesc}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Date & Time</h4>
                  <p>{formatMatchDate(matchInfo.startDate)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Venue</h4>
                  <p>
                    {matchInfo.venueInfo?.ground}, {matchInfo.venueInfo?.city}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Format</h4>
                  <p>{matchInfo.matchFormat}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "scorecard" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Scorecard</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
                </div>
              ) : scorecard ? (
                <div className="space-y-6">
                  {/* Team 1 Scorecard */}
                  <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b dark:border-gray-700">
                      <h4 className="font-medium">{team1.teamName} Innings</h4>
                    </div>
                    <div className="p-4">
                      {team1Score.runs !== undefined ? (
                        <p className="text-lg font-bold">
                          {team1Score.runs}/{team1Score.wickets} (
                          {team1Score.overs} overs)
                        </p>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          No scorecard available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Team 2 Scorecard */}
                  <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b dark:border-gray-700">
                      <h4 className="font-medium">{team2.teamName} Innings</h4>
                    </div>
                    <div className="p-4">
                      {team2Score.runs !== undefined ? (
                        <p className="text-lg font-bold">
                          {team2Score.runs}/{team2Score.wickets} (
                          {team2Score.overs} overs)
                        </p>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          No scorecard available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Scorecard not available for this match.
                </p>
              )}
            </div>
          )}

          {activeTab === "commentary" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Commentary</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
                </div>
              ) : commentary ? (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p>
                    {commentary.commentary ||
                      "Live commentary will be available when the match starts."}
                  </p>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Commentary not available for this match.
                </p>
              )}
            </div>
          )}

          {activeTab === "overs" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Overs Details</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
                </div>
              ) : overDetails && overDetails.length > 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Overs Breakdown</h4>
                  <div className="space-y-2">
                    {overDetails.map((over, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          Over {index + 1}:
                        </span>
                        <span className="font-medium">
                          {over.runs} runs ({over.wickets} wickets)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No overs details available for this match.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CricketMatchDetailsPage;

import { Link } from "react-router-dom";
import { format } from "date-fns";

const CricketMatchCard = ({ match }) => {
  // Format date for display
  const formatMatchDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "PPP p"); // Example: 'April 29, 2023 7:30 PM'
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString || "Date not available";
    }
  };

  // Extract match info from the API structure
  const matchInfo = match.matchInfo || match;
  const matchScore = match.matchScore || {};

  // Get team names and scores
  const team1 = matchInfo.team1 || {};
  const team2 = matchInfo.team2 || {};
  const team1Score = matchScore.team1Score?.inngs1 || {};
  const team2Score = matchScore.team2Score?.inngs1 || {};

  // Determine match status class
  const getStatusClass = (state) => {
    if (!state) return "bg-gray-500 text-white";

    const lowerState = state.toLowerCase();
    if (lowerState.includes("progress") || lowerState.includes("live")) {
      return "bg-red-500 text-white";
    } else if (
      lowerState.includes("complete") ||
      lowerState.includes("finished")
    ) {
      return "bg-gray-500 text-white";
    } else {
      return "bg-green-500 text-white";
    }
  };

  return (
    <Link to={`/cricket/matches/${matchInfo.matchId}`}>
      <div className="card p-4 mb-4 transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
            {matchInfo.seriesName || "Cricket Match"}
          </span>
          <span
            className={`text-xs font-bold px-2 py-1 rounded ${getStatusClass(
              matchInfo.state
            )}`}
          >
            {matchInfo.status || matchInfo.state || "Upcoming"}
          </span>
        </div>

        <div className="text-center text-xs text-gray-600 dark:text-gray-400 mb-2">
          {matchInfo.matchDesc || ""}
        </div>

        <div className="flex justify-between items-center my-3">
          <div className="text-left flex-1">
            <p className="font-bold text-lg">{team1.teamName || "Team 1"}</p>
            {team1Score.runs !== undefined && (
              <p className="text-sm font-semibold">
                {`${team1Score.runs}/${team1Score.wickets} (${team1Score.overs} ov)`}
              </p>
            )}
          </div>

          <div className="mx-4 text-center">
            <span className="text-xl font-bold">vs</span>
          </div>

          <div className="text-right flex-1">
            <p className="font-bold text-lg">{team2.teamName || "Team 2"}</p>
            {team2Score.runs !== undefined && (
              <p className="text-sm font-semibold">
                {`${team2Score.runs}/${team2Score.wickets} (${team2Score.overs} ov)`}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          <p>{formatMatchDate(matchInfo.startDate)}</p>
          <p className="text-xs">
            {matchInfo.venueInfo?.ground}, {matchInfo.venueInfo?.city}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CricketMatchCard;

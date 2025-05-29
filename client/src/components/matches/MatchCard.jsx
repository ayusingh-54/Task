import { Link } from "react-router-dom";
import { format } from "date-fns";

const MatchCard = ({ match }) => {
  // Format date based on the API
  const formatMatchDate = (dateString) => {
    try {
      // Try to parse the date
      const date = new Date(dateString);
      return format(date, "PPP p"); // Example: 'April 29, 2023 7:30 PM'
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString || "Date not available";
    }
  };

  // Extract match properties based on the API structure
  const getMatchProperties = () => {
    // Check for api-basketball.com structure (game object from api-sports)
    if (match.league && match.teams && match.scores) {
      return {
        id: match.id,
        homeTeam: match.teams.home.name,
        awayTeam: match.teams.away.name,
        date: formatMatchDate(match.date),
        competition: match.league.name || "Unknown League",
        status: match.status.long || "Scheduled",
      };
    }
    // Check for football-data.org structure
    if (match.homeTeam && match.awayTeam && match.competition) {
      return {
        id: match.id,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        date: formatMatchDate(match.utcDate),
        competition: match.competition?.name || "Unknown Competition",
        status: match.status || "SCHEDULED",
      };
    }

    // Fallback for basketball (balldontlie.io structure, if it was still partially used or for old mock data)
    if (match.home_team && match.visitor_team) {
      return {
        id: match.id,
        homeTeam: match.home_team.full_name,
        awayTeam: match.visitor_team.full_name,
        date: formatMatchDate(match.date),
        competition: `${match.season} NBA Season`,
        status: match.status || "Scheduled",
      };
    }

    // Fallback for unknown structure
    return {
      id: match.id || "unknown",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      date: "Date not available",
      competition: "Unknown Competition",
      status: "Unknown Status",
    };
  };

  const { id, homeTeam, awayTeam, date, competition, status } =
    getMatchProperties();

  return (
    <Link to={`/matches/${id}`}>
      <div className="card p-4 mb-4 transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
            {competition}
          </span>
          <span
            className={`text-xs font-bold px-2 py-1 rounded ${
              status.toLowerCase().includes("live") ||
              status.toLowerCase().includes("progress") ||
              status.toLowerCase().includes("1st quarter") ||
              status.toLowerCase().includes("halftime") // More basketball statuses
                ? "bg-red-500 text-white"
                : status.toLowerCase().includes("finished") ||
                  status.toLowerCase().includes("final")
                ? "bg-gray-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="flex justify-between items-center my-3">
          <div className="text-left flex-1">
            <p className="font-bold text-lg">{homeTeam}</p>
          </div>

          <div className="mx-4 text-center">
            <span className="text-xl font-bold">vs</span>
          </div>

          <div className="text-right flex-1">
            <p className="font-bold text-lg">{awayTeam}</p>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          <p>{date}</p>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;

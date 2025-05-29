import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import useMatchesStore from "../store/matchesStore";
import matchesService from "../services/matchesService"; // Keep for H2H if needed

const MatchDetailsPage = () => {
  const { id } = useParams();
  const { currentMatch, loading, error, fetchMatchById, clearCurrentMatch } =
    useMatchesStore();
  const [headToHead, setHeadToHead] = useState(null);
  const [headToHeadLoading, setHeadToHeadLoading] = useState(false);
  const [isBasketballApiSports, setIsBasketballApiSports] = useState(false);

  useEffect(() => {
    fetchMatchById(id);
    return () => clearCurrentMatch();
  }, [id, fetchMatchById, clearCurrentMatch]);

  useEffect(() => {
    if (
      currentMatch &&
      currentMatch.league &&
      currentMatch.teams &&
      currentMatch.scores
    ) {
      setIsBasketballApiSports(true);
    } else {
      setIsBasketballApiSports(false);
    }

    const fetchHeadToHeadData = async () => {
      if (!currentMatch) return;
      setHeadToHeadLoading(true);
      try {
        let team1Id, team2Id;
        if (isBasketballApiSports) {
          team1Id = currentMatch.teams?.home?.id;
          team2Id = currentMatch.teams?.away?.id;
        } else if (currentMatch.homeTeam && currentMatch.awayTeam) {
          // football-data.org
          team1Id = currentMatch.homeTeam.id;
          team2Id = currentMatch.awayTeam.id;
        } else if (currentMatch.home_team && currentMatch.visitor_team) {
          // balldontlie.io (legacy)
          team1Id = currentMatch.home_team.id;
          team2Id = currentMatch.visitor_team.id;
        }

        if (team1Id && team2Id) {
          const data = await matchesService.getHeadToHead(team1Id, team2Id);
          // For api-basketball, H2H response is also { response: [...] }
          setHeadToHead(data.response || data); // Adjust based on actual H2H response structure
        } else {
          setHeadToHead(null);
        }
      } catch (err) {
        console.error("Error fetching head-to-head data:", err);
        setHeadToHead({ message: "Could not load head-to-head data." });
      } finally {
        setHeadToHeadLoading(false);
      }
    };

    if (currentMatch && (currentMatch.id || currentMatch.gameId)) {
      // Ensure currentMatch is populated
      fetchHeadToHeadData();
    }
  }, [currentMatch, isBasketballApiSports]);

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
          Back to Matches
        </Link>
      </div>
    );
  }

  if (!currentMatch) {
    return (
      <div className="text-center p-8">
        <p>Match not found.</p>
        <Link to="/matches" className="btn btn-primary mt-4 inline-block">
          Back to Matches
        </Link>
      </div>
    );
  }

  // Format date based on the API (football or basketball)
  const formatMatchDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "PPP p"); // Example: 'April 29, 2023 7:30 PM'
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString || "Date not available";
    }
  };

  // Extract match details based on the API structure
  const getMatchDetails = () => {
    // For api-basketball.com
    if (isBasketballApiSports) {
      return {
        homeTeam: currentMatch.teams.home.name,
        homeTeamId: currentMatch.teams.home.id,
        homeTeamLogo: currentMatch.teams.home.logo,
        awayTeam: currentMatch.teams.away.name,
        awayTeamId: currentMatch.teams.away.id,
        awayTeamLogo: currentMatch.teams.away.logo,
        date: formatMatchDate(currentMatch.date),
        competition: `${currentMatch.league.name} ${currentMatch.league.season}`,
        venue: currentMatch.arena?.name || currentMatch.country?.name || "N/A", // api-basketball might have arena in game details
        status: currentMatch.status.long,
        score: {
          home: currentMatch.scores.home.total ?? "TBD",
          away: currentMatch.scores.away.total ?? "TBD",
        },
      };
    }
    // For Football API (football-data.org)
    if (currentMatch.homeTeam && currentMatch.awayTeam) {
      return {
        homeTeam: currentMatch.homeTeam.name,
        homeTeamId: currentMatch.homeTeam.id,
        awayTeam: currentMatch.awayTeam.name,
        awayTeamId: currentMatch.awayTeam.id,
        date: formatMatchDate(currentMatch.utcDate),
        competition: currentMatch.competition?.name || "Unknown Competition",
        venue: currentMatch.venue || "Venue not available",
        status: currentMatch.status || "SCHEDULED",
        score: currentMatch.score
          ? {
              home: currentMatch.score.fullTime?.homeTeam ?? "TBD",
              away: currentMatch.score.fullTime?.awayTeam ?? "TBD",
            }
          : { home: "TBD", away: "TBD" },
      };
    }

    // For Basketball API (balldontlie.io - legacy)
    if (currentMatch.home_team && currentMatch.visitor_team) {
      return {
        homeTeam: currentMatch.home_team.full_name,
        homeTeamId: currentMatch.home_team.id,
        awayTeam: currentMatch.visitor_team.full_name,
        awayTeamId: currentMatch.visitor_team.id,
        date: formatMatchDate(currentMatch.date),
        competition: `${currentMatch.season} NBA Season`,
        venue: currentMatch.home_team.city,
        status: currentMatch.status || "Scheduled",
        score: {
          home: currentMatch.home_team_score || "TBD",
          away: currentMatch.visitor_team_score || "TBD",
        },
      };
    }

    return {
      homeTeam: "Home Team",
      homeTeamId: 0,
      awayTeam: "Away Team",
      awayTeamId: 0,
      date: "Date not available",
      competition: "Unknown Competition",
      venue: "Unknown Venue",
      status: "Unknown Status",
      score: { home: "TBD", away: "TBD" },
    };
  };

  const {
    homeTeam,
    homeTeamId,
    awayTeam,
    awayTeamId,
    homeTeamLogo, // New for basketball
    awayTeamLogo, // New for basketball
    date,
    competition,
    venue,
    status,
    score,
  } = getMatchDetails();

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/matches"
        className="inline-block mb-6 text-primary-light dark:text-primary-dark hover:underline"
      >
        ← Back to Matches
      </Link>

      <div className="card p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            {homeTeamLogo && (
              <img src={homeTeamLogo} alt={homeTeam} className="w-8 h-8 mr-2" />
            )}
            {homeTeam} vs{" "}
            {awayTeamLogo && (
              <img
                src={awayTeamLogo}
                alt={awayTeam}
                className="w-8 h-8 ml-2 mr-2"
              />
            )}
            {awayTeam}
          </h1>
          <span
            className={`text-sm font-bold px-3 py-1 rounded-full ${
              status.toLowerCase().includes("live") ||
              status.toLowerCase().includes("progress") ||
              status.toLowerCase().includes("1st quarter") ||
              status.toLowerCase().includes("halftime")
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

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center mb-6 md:mb-0">
              {homeTeamLogo && (
                <img
                  src={homeTeamLogo}
                  alt={homeTeam}
                  className="w-16 h-16 mx-auto mb-2"
                />
              )}
              <h2 className="text-2xl md:text-3xl font-bold">{homeTeam}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Home</p>
              <p className="text-3xl md:text-5xl font-bold mt-4">
                {score.home}
              </p>
            </div>

            <div className="text-center mb-6 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {competition}
              </p>
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-primary-light dark:bg-primary-dark rounded-full text-white mx-auto">
                <span className="text-xl md:text-2xl font-bold">VS</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{date}</p>
            </div>

            <div className="text-center">
              {awayTeamLogo && (
                <img
                  src={awayTeamLogo}
                  alt={awayTeam}
                  className="w-16 h-16 mx-auto mb-2"
                />
              )}
              <h2 className="text-2xl md:text-3xl font-bold">{awayTeam}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Away</p>
              <p className="text-3xl md:text-5xl font-bold mt-4">
                {score.away}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Match Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Competition:</span>{" "}
                {competition}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {date}
              </p>
              <p>
                <span className="font-semibold">Venue:</span> {venue}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {status}
              </p>
            </div>
          </div>

          {/* Head-to-Head Section */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Head-to-Head</h3>
            {headToHeadLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
              </div>
            ) : headToHead ? (
              <div>
                {headToHead.message ? (
                  <p className="text-gray-600 dark:text-gray-400">
                    {headToHead.message}
                  </p>
                ) : Array.isArray(headToHead) && headToHead.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {headToHead.slice(0, 3).map(
                      (
                        game // Displaying first 3 H2H games as example
                      ) => (
                        <li
                          key={game.id}
                          className="text-gray-600 dark:text-gray-400"
                        >
                          {format(new Date(game.date), "dd MMM yyyy")}:{" "}
                          {game.teams?.home?.name} {game.scores?.home?.total} -{" "}
                          {game.scores?.away?.total} {game.teams?.away?.name}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No detailed head-to-head data to display.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No head-to-head data available.
              </p>
            )}
          </div>
        </div>

        {/* Additional Statistics Section - Can be expanded based on available data */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Match Statistics</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-center text-gray-600 dark:text-gray-400">
              {status === "SCHEDULED" || status === "Scheduled"
                ? "Statistics will be available once the match begins."
                : "Detailed statistics available in the full version."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsPage;

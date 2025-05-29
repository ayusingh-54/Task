import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import useMatchesStore from "../../store/matchesStore";
import { SPORTS } from "../../services/apiHelper";

const BasketballStandingsPage = () => {
  const { competitionCode = "12" } = useParams(); // Default to NBA (league ID 12)
  const location = useLocation();

  const { standings, loading, error, fetchCompetitionStandings } =
    useMatchesStore();

  const [leagueId, setLeagueId] = useState(competitionCode);
  const [season, setSeason] = useState(
    new URLSearchParams(location.search).get("season") ||
      `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`
  );
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setFetchError(null);
        await fetchCompetitionStandings(leagueId, season, SPORTS.BASKETBALL);
      } catch (err) {
        // Handle the error locally too
        setFetchError(
          `Unable to fetch standings. Please try again later. (Error: ${err.message})`
        );
      }
    }

    fetchData();
  }, [fetchCompetitionStandings, leagueId, season]);

  const handleLeagueChange = (e) => {
    if (e.key === "Enter") {
      setLeagueId(e.target.value.trim());
    }
  };

  const handleSeasonChange = (e) => {
    if (e.key === "Enter") {
      setSeason(e.target.value.trim());
    }
  };

  // Extract data from the basketball standings API response
  let leagueName = "Basketball Standings";
  let leagueLogo = "";
  let tableData = [];
  let conferenceGroups = [];

  if (standings && standings.response && standings.response[0]?.league) {
    const leagueData = standings.response[0].league;
    leagueName = `${leagueData.name} ${leagueData.season}`;
    leagueLogo = leagueData.logo;

    // Check if there are multiple conferences/groups
    if (
      Array.isArray(leagueData.standings) &&
      leagueData.standings.length > 0
    ) {
      // Each item in standings array is a conference/group
      conferenceGroups = leagueData.standings.map((groupStandings, index) => {
        // Get the group name from the first team's group property
        const groupName =
          groupStandings[0]?.group?.name || `Group ${index + 1}`;
        return {
          name: groupName,
          standings: groupStandings,
        };
      });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
      </div>
    );
  }

  // Show combined error (from store or local)
  const displayError = error || fetchError;
  if (displayError) {
    return (
      <div className="text-center p-8 bg-red-100 dark:bg-red-900 rounded-lg">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-300 mb-2">
          Error Loading Standings
        </h2>
        <p className="mb-4">{displayError}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This could be due to a network issue or the server may be unavailable.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() =>
              fetchCompetitionStandings(leagueId, season, SPORTS.BASKETBALL)
            }
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
          <Link
            to="/basketball/matches"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            View Matches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center flex items-center justify-center">
        {leagueLogo && (
          <img src={leagueLogo} alt="" className="h-10 w-10 mr-3" />
        )}
        {leagueName}
      </h1>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
        <div>
          <label htmlFor="leagueInput" className="mr-2">
            League ID:
          </label>
          <input
            type="text"
            id="leagueInput"
            defaultValue={leagueId}
            onKeyDown={handleLeagueChange}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="e.g., 12 (NBA)"
          />
        </div>
        <div>
          <label htmlFor="seasonInput" className="mr-2">
            Season:
          </label>
          <input
            type="text"
            id="seasonInput"
            defaultValue={season}
            onKeyDown={handleSeasonChange}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="e.g., 2023-2024"
          />
        </div>
        <div>
          <button
            onClick={() => fetchCompetitionStandings(leagueId, season)}
            className="btn btn-primary"
          >
            Update
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
        <p>
          Common League IDs: 12 (NBA), 13 (NCAA), 1 (EuroLeague), 174 (NBA G
          League)
        </p>
      </div>

      {!loading && !error && conferenceGroups.length > 0 ? (
        <div className="space-y-10">
          {conferenceGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">{group.name}</h2>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Pos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Games
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      W
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      L
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Win %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {group.standings.map((row) => (
                    <tr key={row.team.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {row.team.logo && (
                            <img
                              src={row.team.logo}
                              alt={row.team.name}
                              className="w-8 h-8 mr-3"
                            />
                          )}
                          <span>{row.team.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.games?.played}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.games?.win?.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.games?.lose?.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.games?.win?.percentage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-xl">
              No standings data available for this league/season.
            </p>
            <p className="mt-2">Try a different league ID or season.</p>
          </div>
        )
      )}
    </div>
  );
};

export default BasketballStandingsPage;

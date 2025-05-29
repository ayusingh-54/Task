import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom"; // Added useLocation
import useMatchesStore from "../store/matchesStore";

const CompetitionStandingsPage = () => {
  const { competitionCode = "PL" } = useParams(); // For football: PL, BL1 etc. For basketball: leagueId e.g. 12 for NBA
  const location = useLocation(); // To get query params like ?season=2023-2024

  const { standings, loading, error, fetchCompetitionStandings } =
    useMatchesStore();

  const [displayCode, setDisplayCode] = useState(competitionCode.toUpperCase());
  // Default season or get from query. For basketball, season is crucial.
  const [season, setSeason] = useState(
    new URLSearchParams(location.search).get("season") ||
      `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`
  );
  const [isBasketball, setIsBasketball] = useState(false); // To determine rendering logic

  useEffect(() => {
    // Crude way to check if it's likely a basketball league ID (numeric) vs football code (alphanumeric)
    const probablyBasketball = /^\d+$/.test(displayCode);
    setIsBasketball(probablyBasketball);

    if (probablyBasketball && !season) {
      // If basketball and no season, maybe set a default or show error.
      // For now, fetch will likely use the default season state.
      console.warn("Season parameter is recommended for basketball standings.");
    }
    fetchCompetitionStandings(
      displayCode,
      probablyBasketball ? season : undefined
    );
  }, [fetchCompetitionStandings, displayCode, season]);

  const handleCodeChange = (e) => {
    if (e.key === "Enter") {
      setDisplayCode(e.target.value.toUpperCase().trim());
    }
  };

  const handleSeasonChange = (e) => {
    if (e.key === "Enter") {
      setSeason(e.target.value.trim());
    }
  };

  // Adapt parsing for standings data based on whether it's football or basketball
  let competitionName = displayCode;
  let tableData = [];

  if (standings) {
    if (isBasketball && standings.response && standings.response[0]?.league) {
      const leagueData = standings.response[0].league;
      competitionName = `${leagueData.name} ${leagueData.season}`;
      // api-basketball standings are often grouped (e.g., by conference)
      // This example takes the first group/conference's standings
      tableData = leagueData.standings?.[0] || [];
    } else if (
      !isBasketball &&
      standings.standings &&
      standings.standings[0]?.table
    ) {
      // Football
      competitionName = standings.competition?.name || displayCode;
      tableData = standings.standings[0].table;
    } else if (standings.message) {
      competitionName = displayCode; // Keep input code if error
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-center">
        Standings: {competitionName}
      </h1>
      <div className="mb-4 text-center space-y-2 md:space-y-0 md:space-x-4">
        <div>
          <label htmlFor="competitionCodeInput" className="mr-2">
            Enter Competition Code/League ID:
          </label>
          <input
            type="text"
            id="competitionCodeInput"
            defaultValue={displayCode}
            onKeyDown={handleCodeChange}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="e.g., PL or 12 (NBA)"
          />
        </div>
        {isBasketball && ( // Show season input only for basketball
          <div>
            <label htmlFor="seasonInput" className="mr-2">
              Season (YYYY-YYYY):
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
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Press Enter in respective fields to update. For basketball, provide
          League ID (e.g., 12 for NBA) and season.
        </p>
      </div>

      {loading && <p>Loading...</p> /* Simplified loading */}
      {!loading && error && <p>Error: {error}</p> /* Simplified error */}

      {!loading && !error && standings && tableData.length > 0 ? (
        <div className="overflow-x-auto card p-4">
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
                  P
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  W
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  L
                </th>
                {isBasketball && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Win %
                  </th>
                )}
                {!isBasketball && ( // Football specific columns
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      D
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      GF
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      GA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      GD
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Pts
                    </th>
                  </>
                )}
                {isBasketball && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Group/Conf
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {tableData.map((row, index) => (
                <tr key={isBasketball ? row.team.id : row.team.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {row.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    {row.team.logo && (
                      <img
                        src={row.team.logo}
                        alt={row.team.name}
                        className="w-6 h-6 mr-2"
                      />
                    )}
                    {!row.team.logo && row.team.crest && (
                      <img
                        src={row.team.crest}
                        alt={row.team.name}
                        className="w-6 h-6 mr-2"
                      />
                    )}{" "}
                    {/* Football crest */}
                    {row.team.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isBasketball ? row.games?.played : row.playedGames}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isBasketball ? row.games?.win?.total : row.won}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isBasketball ? row.games?.lose?.total : row.lost}
                  </td>
                  {isBasketball && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.games?.win?.percentage}
                    </td>
                  )}
                  {!isBasketball && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.draw}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.goalsFor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.goalsAgainst}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.goalDifference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        {row.points}
                      </td>
                    </>
                  )}
                  {isBasketball && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.group?.name}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xl">
            No standings data available for {displayCode}.
          </p>
          {standings?.message && (
            <p className="text-sm mt-2">{standings.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CompetitionStandingsPage;

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useMatchesStore from "../../store/matchesStore";

const FootballStandingsPage = () => {
  const { competitionCode = "PL" } = useParams(); // Default to Premier League

  const { standings, loading, error, fetchCompetitionStandings } =
    useMatchesStore();

  const [displayCode, setDisplayCode] = useState(competitionCode.toUpperCase());

  useEffect(() => {
    fetchCompetitionStandings(displayCode);
  }, [fetchCompetitionStandings, displayCode]);

  const handleCodeChange = (e) => {
    if (e.key === "Enter") {
      setDisplayCode(e.target.value.toUpperCase().trim());
    }
  };

  // Football standings parsing
  let competitionName = displayCode;
  let competitionEmblem = "";
  let tableData = [];

  if (standings) {
    if (standings.standings && standings.standings[0]?.table) {
      competitionName = standings.competition?.name || displayCode;
      competitionEmblem = standings.competition?.emblem || "";
      tableData = standings.standings[0].table;
    } else if (standings.message) {
      competitionName = displayCode; // Keep input code if error
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center flex items-center justify-center">
        {competitionEmblem && (
          <img src={competitionEmblem} alt="" className="h-10 w-10 mr-3" />
        )}
        {competitionName} Standings
      </h1>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
        <div>
          <label htmlFor="competitionCodeInput" className="mr-2">
            Competition Code:
          </label>
          <input
            type="text"
            id="competitionCodeInput"
            defaultValue={displayCode}
            onKeyDown={handleCodeChange}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="e.g., PL"
          />
        </div>
        <div>
          <button
            onClick={() => fetchCompetitionStandings(displayCode)}
            className="btn btn-primary"
          >
            Update
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
        <p>
          Common Codes: PL (Premier League), PD (La Liga), SA (Serie A), BL1
          (Bundesliga), FL1 (Ligue 1), CL (Champions League)
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        </div>
      )}

      {error && (
        <div className="text-center p-8 bg-red-100 dark:bg-red-900 rounded-lg">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-300 mb-2">
            Error
          </h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && tableData.length > 0 ? (
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
                  D
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  L
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
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {tableData.map((row) => (
                <tr key={row.team.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {row.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {row.team.crest && (
                        <img
                          src={row.team.crest}
                          alt={row.team.name}
                          className="w-8 h-8 mr-3"
                        />
                      )}
                      <span>{row.team.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {row.playedGames}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.won}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.draw}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.lost}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-xl">
              No standings data available for {displayCode}.
            </p>
            {standings?.message && (
              <p className="text-sm mt-2">{standings.message}</p>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default FootballStandingsPage;

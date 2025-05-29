import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SportSelector = () => {
  const location = useLocation();
  const [selectedSport, setSelectedSport] = useState("football");

  // Update selected sport based on current URL
  useEffect(() => {
    if (location.pathname.includes("/basketball")) {
      setSelectedSport("basketball");
    } else if (location.pathname.includes("/cricket")) {
      setSelectedSport("cricket");
    } else if (location.pathname.includes("/football")) {
      setSelectedSport("football");
    } else {
      // Default paths like /matches or / will use football
      setSelectedSport("football");
    }
  }, [location.pathname]);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full flex items-center">
      <Link
        to="/football/today"
        className={`px-4 py-2 rounded-full transition-colors ${
          selectedSport === "football"
            ? "bg-primary-light dark:bg-primary-dark text-white font-medium"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        onClick={() => setSelectedSport("football")}
      >
        Football
      </Link>
      <Link
        to="/basketball/today"
        className={`px-4 py-2 rounded-full transition-colors ${
          selectedSport === "basketball"
            ? "bg-primary-light dark:bg-primary-dark text-white font-medium"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        onClick={() => setSelectedSport("basketball")}
      >
        Basketball
      </Link>
      {/* <Link
        to="/cricket/matches"
        className={`px-4 py-2 rounded-full transition-colors ${
          selectedSport === "cricket"
            ? "bg-primary-light dark:bg-primary-dark text-white font-medium"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        onClick={() => setSelectedSport("cricket")}
      >
        Cricket
      </Link> */}
    </div>
  );
};

export default SportSelector;

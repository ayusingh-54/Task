/**
 * Helper function to add sport type to API calls
 * This can be used to tell the backend which sport to use for a given API call
 *
 * @param {string} endpoint - The API endpoint
 * @param {string} sport - The sport type ('football' or 'basketball')
 * @returns {string} - The endpoint with sport type query parameter
 */
export const addSportParam = (endpoint, sport) => {
  // Add sport type as a query parameter
  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}sportType=${sport}`;
};

/**
 * Constants for sport types
 */
export const SPORTS = {
  FOOTBALL: "football",
  BASKETBALL: "basketball",
  CRICKET: "cricket", // Add cricket to the sports types
};

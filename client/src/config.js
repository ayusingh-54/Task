/**
 * Application configuration
 * Controls app behavior including API settings and feature flags
 */

const config = {
  // API configuration
  api: {
    // Base URL for API requests - will default to Vercel deployment
    baseUrl:
      import.meta.env.VITE_API_URL?.replace(/\/$/, '') || "https://task-mu-silk.vercel.app",

    // When true, requests go through Vite's proxy to avoid CORS
    useProxy: import.meta.env.VITE_USE_PROXY === "true" || false,

    // Request timeout in milliseconds
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },

  // Feature flags
  features: {
    // Enable detailed error logging in console
    enableErrorLogging:
      import.meta.env.VITE_ENABLE_ERROR_LOGGING === "true" || true,

    // Use mock data when API fails or for specific endpoints
    fallbackToMockData:
      import.meta.env.VITE_FALLBACK_TO_MOCK_DATA === "true" || true,

    // Always use mock data instead of real API calls
    // This is set by the VITE_USE_MOCK_DATA environment variable
    alwaysUseMockData: import.meta.env.VITE_USE_MOCK_DATA === "true" || false,
  },

  // Default sport for the application
  defaultSport: "football",

  // Development settings
  dev: {
    // Show debug information
    debug: import.meta.env.DEV || false,

    // Mock API delay (in ms) to simulate network requests
    mockDelay: 500,
  },
};

// Log configuration in development
if (config.dev.debug) {
  console.log("App config:", {
    usingMockData: config.features.alwaysUseMockData,
    fallbackEnabled: config.features.fallbackToMockData,
    apiBaseUrl: config.api.baseUrl,
    usingProxy: config.api.useProxy,
  });

  if (config.features.alwaysUseMockData) {
    console.log(
      "ℹ️ Application is configured to use mock data (VITE_USE_MOCK_DATA=true)"
    );
  }
}

export default config;

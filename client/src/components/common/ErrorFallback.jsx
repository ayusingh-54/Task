import React from "react";
import { Link } from "react-router-dom";

const ErrorFallback = ({
  error,
  resetError,
  fallbackLink = "/",
  fallbackLinkText = "Go to Home",
}) => {
  return (
    <div className="text-center p-8 bg-red-50 dark:bg-red-900/30 rounded-lg shadow-md max-w-3xl mx-auto">
      <div className="flex justify-center mb-4">
        <svg
          className="w-16 h-16 text-red-500 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-red-600 dark:text-red-300 mb-4">
        Something went wrong
      </h2>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-md mb-6 text-left overflow-auto max-h-48">
        <p className="text-gray-700 dark:text-gray-300 break-words">
          {error || "An unknown error occurred."}
        </p>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        This might be due to a network issue or the server might be unavailable.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {resetError && (
          <button
            onClick={resetError}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        )}

        <Link
          to={fallbackLink}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          {fallbackLinkText}
        </Link>
      </div>
    </div>
  );
};

export default ErrorFallback;

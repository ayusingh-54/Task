import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link
              to="/"
              className="text-xl font-bold text-primary-light dark:text-primary-dark"
            >
              Match Tracker
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Stay updated with your favorite sports matches
            </p>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-center">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark"
            >
              Home
            </Link>
            <Link
              to="/matches"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark"
            >
              Matches
            </Link>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark"
              onClick={(e) => e.preventDefault()}
            >
              About
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {currentYear} Match Tracker. All rights reserved.</p>
          <p className="mt-1">
            Data provided by external sports APIs. This app is for educational
            purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

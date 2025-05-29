import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check if user prefers dark mode or has previously set a preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem("darkMode");
  const initialDarkMode =
    storedTheme !== null ? JSON.parse(storedTheme) : prefersDark;

  const [darkMode, setDarkMode] = useState(initialDarkMode);

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Value object to be provided by the context
  const value = {
    darkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;

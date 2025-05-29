require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const matchesRouter = require("./routes/matches");
const teamsRouter = require("./routes/teams");
const cricketRouter = require("./routes/cricket"); // Add cricket router

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rate limiting - Increase limits to avoid 429 errors during development
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased from 100 to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api", apiLimiter);

// Routes
app.use("/api/matches", matchesRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/cricket", cricketRouter); // Add cricket routes

// Base route
app.get("/", (req, res) => {
  res.send("Sports Match Tracker API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

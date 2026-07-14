require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./database");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const applicationRoutes = require("./routes/applications");

const app = express();

// =======================
// CORS
// =======================

const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://incongnito-00.github.io",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked Origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// Home
// =======================

app.get("/", (req, res) => {
  res.json({
    success: true,
    project: "Projexa V2 Backend",
    version: "2.0",
    status: "Running 🚀",
  });
});

// =======================
// Health
// =======================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    database: "Connected",
    server: "Running",
    uptime: process.uptime(),
  });
});

// =======================
// Routes
// =======================

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/applications", applicationRoutes);

// =======================
// 404
// =======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// =======================
// Error Handler
// =======================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =======================
// Start Server
// =======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("==================================");
  console.log("🚀 PROJEXA V2 BACKEND STARTED");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("✅ PostgreSQL");
  console.log("✅ JWT");
  console.log("✅ Google Login");
  console.log("==================================");
});
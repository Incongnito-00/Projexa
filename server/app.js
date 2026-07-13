const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initialize database
require("./database");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const applicationRoutes = require("./routes/applications");

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// Middleware
// =========================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// Root Route
// =========================

app.get("/", (req, res) => {
    res.json({
        success: true,
        app: "Projexa API",
        version: "1.0.0",
        message: "Backend Running Successfully"
    });
});

// =========================
// Health Check
// =========================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "Running",
        database: "Connected"
    });
});

// =========================
// API Routes
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/applications", applicationRoutes);

// =========================
// 404 Handler
// =========================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found"
    });
});

// =========================
// Error Handler
// =========================

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

// =========================
// Start Server
// =========================

app.listen(PORT, () => {
    console.log("======================================");
    console.log("🚀 PROJEXA BACKEND");
    console.log("======================================");
    console.log(`Server : http://localhost:${PORT}`);
    console.log(`Health : http://localhost:${PORT}/api/health`);
    console.log("======================================");
});
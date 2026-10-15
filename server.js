
"use strict";

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const Distributor = require("./models/Distributor");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Softina Natural Ventures API is running."
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        database: mongoose.connection.readyState === 1
            ? "connected"
            : "disconnected"
    });
});


app.get("/api/distributors", async (req, res) => {
    try {
        const distributors = await Distributor.find()
            .sort({ createdAt: -1 })
            .limit(500);

        res.json({
            success: true,
            total: distributors.length,
            distributors
        });
    } catch (error) {
        console.error("Error fetching distributors:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve distributors."
        });
    }
});


async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "MONGODB_URI is missing. Please configure your .env file."
            );
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connected to MongoDB Atlas.");

        app.listen(PORT, "127.0.0.1", () => {
            console.log(`Softina API running at http://127.0.0.1:${PORT}`);
            console.log(`Health check: http://127.0.0.1:${PORT}/api/health`);
        });
    } catch (error) {
        console.error("Backend startup failed:", error.message);
        process.exit(1);
    }
}

startServer();

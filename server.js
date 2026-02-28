const express = require("express");
const os = require("os");
const path = require("path");

const app = express();
const PORT = 8080;

// serve static files (css, js)
app.use(express.static(__dirname));

// root -> index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// simple API to show instance details
app.get("/api/info", (req, res) => {
    res.json({
        hostname: os.hostname(),
        cpus: os.cpus().length,
        loadavg: os.loadavg(),
        uptime: process.uptime()
    });
});

// health check endpoint (for load balancer)
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
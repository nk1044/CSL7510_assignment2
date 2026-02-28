const express = require("express");
const os = require("os");
const path = require("path");

const app = express();
const PORT = 8080;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/info", (req, res) => {
    res.json({
        hostname: os.hostname(),
        cpus: os.cpus().length,
        loadavg: os.loadavg(),
        uptime: process.uptime()
    });
});

app.get("/cpu", (req, res) => {
    const end = Date.now() + 15000;
    while (Date.now() < end) {
        Math.sqrt(Math.random());
    }
    res.send("CPU load generated");
});

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
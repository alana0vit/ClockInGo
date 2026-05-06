const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Rota de Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/api", routes);

module.exports = app;

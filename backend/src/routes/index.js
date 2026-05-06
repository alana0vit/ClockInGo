const express = require("express");
const router = express.Router();

// Rotas
const funcionarioRoutes = require("./funcionarioRoutes");

// Prefixo
router.use("/funcionarios", funcionarioRoutes);

module.exports = router;

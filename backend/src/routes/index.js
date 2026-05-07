const express = require("express");
const router = express.Router();

// Importar as rotas
const funcionarioRoutes = require("./funcionarioRoutes");
const authRoutes = require("./authRoutes");

// Registrar de rotas
router.use("/funcionarios", funcionarioRoutes);
router.use("/auth", authRoutes);

module.exports = router;
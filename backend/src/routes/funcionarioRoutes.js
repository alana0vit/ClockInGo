const express = require("express");
const router = express.Router();
const funcionarioController = require("../controllers/funcionarioController");

router.get("/:id", funcionarioController.buscarPorId);

module.exports = router;

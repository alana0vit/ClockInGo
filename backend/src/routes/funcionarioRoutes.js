const express = require("express");
const router = express.Router();
const funcionarioController = require("../controllers/funcionarioController");

router.post("/", funcionarioController.criar);

module.exports = router;

const {
  validateOnAddRows,
  addRows,
} = require("../controllers/sheets.controller");

const express = require("express");
const router = express.Router();

router.post("/add-row", validateOnAddRows(), addRows);

module.exports = router;

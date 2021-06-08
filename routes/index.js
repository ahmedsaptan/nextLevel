const express = require("express");
const router = express.Router();

const sheetsRoute = require("./sheet.routes");

router.use("/sheets", sheetsRoute);

module.exports = router;

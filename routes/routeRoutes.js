const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController");

// 🔎 GET /routes/find?start=xxx&dest=yyy
router.get("/find", routeController.findRoute);

module.exports = router;

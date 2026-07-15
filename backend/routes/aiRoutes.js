const express = require("express");

const router = express.Router();

const {
  getInsights,
  categorize,
} = require("../controllers/aiController");

router.post("/insights", getInsights);

router.post("/categorize", categorize);

module.exports = router;
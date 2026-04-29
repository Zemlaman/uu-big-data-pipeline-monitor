const express = require("express");
const runController = require("../controllers/runController");

const router = express.Router();

router.get("/", runController.getRuns);
router.get("/:id", runController.getRunById);
router.patch("/:id", runController.updateRunStatus);

module.exports = router;
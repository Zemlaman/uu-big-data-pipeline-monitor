const express = require("express");
const alertController = require("../controllers/alertController");

const router = express.Router();

router.get("/", alertController.getAlerts);
router.get("/:id", alertController.getAlertById);

module.exports = router;
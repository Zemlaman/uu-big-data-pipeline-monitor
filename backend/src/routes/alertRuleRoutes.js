const express = require("express");
const alertRuleController = require("../controllers/alertRuleController");

const router = express.Router();

router.post("/", alertRuleController.createAlertRule);
router.get("/", alertRuleController.getAlertRules);
router.get("/:id", alertRuleController.getAlertRuleById);
router.patch("/:id", alertRuleController.updateAlertRule);
router.delete("/:id", alertRuleController.deleteAlertRule);

module.exports = router;
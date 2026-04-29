const mongoose = require("mongoose");

const validateAlertRuleInput = (data) => {
  const errors = [];
  const allowedTypes = ["FAILED_RUN", "RUNTIME_EXCEEDED"];
  const allowedSeverities = ["low", "medium", "high", "critical"];

  if (!data.pipelineId || !mongoose.Types.ObjectId.isValid(data.pipelineId)) {
    errors.push("Valid pipelineId is required");
  }

  if (!data.name || data.name.trim() === "") {
    errors.push("Alert rule name is required");
  }

  if (!data.type || !allowedTypes.includes(data.type)) {
    errors.push("Type must be FAILED_RUN or RUNTIME_EXCEEDED");
  }

  if (
    data.type === "RUNTIME_EXCEEDED" &&
    (!Number.isInteger(data.thresholdMinutes) || data.thresholdMinutes < 1)
  ) {
    errors.push("Threshold minutes is required for RUNTIME_EXCEEDED and must be a positive integer");
  }

  if (data.severity !== undefined && !allowedSeverities.includes(data.severity)) {
    errors.push("Severity must be low, medium, high or critical");
  }

  if (data.enabled !== undefined && typeof data.enabled !== "boolean") {
    errors.push("Enabled must be a boolean");
  }

  return errors;
};

module.exports = {
  validateAlertRuleInput,
};
const Pipeline = require("../models/Pipeline");
const AlertRule = require("../models/AlertRule");

const createAlertRule = async (data) => {
  const pipeline = await Pipeline.findById(data.pipelineId);

  if (!pipeline) {
    const error = new Error("Pipeline not found");
    error.statusCode = 404;
    throw error;
  }

  const alertRule = await AlertRule.create({
    pipelineId: data.pipelineId,
    name: data.name,
    type: data.type,
    thresholdMinutes: data.type === "RUNTIME_EXCEEDED" ? data.thresholdMinutes : null,
    severity: data.severity || "high",
    enabled: data.enabled !== undefined ? data.enabled : true,
  });

  return alertRule;
};

const getAlertRules = async () => {
  return AlertRule.find()
    .populate("pipelineId", "name schedule active")
    .sort({ createdAt: -1 });
};

const getAlertRuleById = async (id) => {
  const alertRule = await AlertRule.findById(id).populate(
    "pipelineId",
    "name schedule active"
  );

  if (!alertRule) {
    const error = new Error("Alert rule not found");
    error.statusCode = 404;
    throw error;
  }

  return alertRule;
};

const updateAlertRule = async (id, data) => {
  const alertRule = await AlertRule.findById(id);

  if (!alertRule) {
    const error = new Error("Alert rule not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.name !== undefined) alertRule.name = data.name;
  if (data.severity !== undefined) alertRule.severity = data.severity;
  if (data.enabled !== undefined) alertRule.enabled = data.enabled;

  if (data.thresholdMinutes !== undefined) {
    alertRule.thresholdMinutes = data.thresholdMinutes;
  }

  await alertRule.save();

  return getAlertRuleById(alertRule._id);
};

const deleteAlertRule = async (id) => {
  const alertRule = await AlertRule.findById(id);

  if (!alertRule) {
    const error = new Error("Alert rule not found");
    error.statusCode = 404;
    throw error;
  }

  await alertRule.deleteOne();

  return {
    message: "Alert rule deleted successfully",
  };
};

module.exports = {
  createAlertRule,
  getAlertRules,
  getAlertRuleById,
  updateAlertRule,
  deleteAlertRule,
};
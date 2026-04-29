const AlertRule = require("../models/AlertRule");
const AlertEvent = require("../models/AlertEvent");

const createFailedRunAlerts = async (run) => {
  const rules = await AlertRule.find({
    pipelineId: run.pipelineId,
    type: "FAILED_RUN",
    enabled: true,
  });

  const createdAlerts = [];

  for (const rule of rules) {
    const alert = await AlertEvent.create({
      ruleId: rule._id,
      pipelineId: run.pipelineId,
      runId: run._id,
      message: `Pipeline run failed: ${run.errorMessage}`,
      severity: rule.severity,
      status: "open",
    });

    createdAlerts.push(alert);
  }

  return createdAlerts;
};

const createRuntimeExceededAlerts = async (run) => {
  if (!run.startedAt || !run.finishedAt) {
    return [];
  }

  const runtimeMilliseconds =
    new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime();

  const runtimeMinutes = runtimeMilliseconds / 1000 / 60;

  const rules = await AlertRule.find({
    pipelineId: run.pipelineId,
    type: "RUNTIME_EXCEEDED",
    enabled: true,
  });

  const createdAlerts = [];

  for (const rule of rules) {
    if (!rule.thresholdMinutes) {
      continue;
    }

    if (runtimeMinutes > rule.thresholdMinutes) {
      const roundedRuntime = Math.round(runtimeMinutes * 100) / 100;

      const alert = await AlertEvent.create({
        ruleId: rule._id,
        pipelineId: run.pipelineId,
        runId: run._id,
        message: `Pipeline run exceeded runtime threshold: ${roundedRuntime} minutes > ${rule.thresholdMinutes} minutes`,
        severity: rule.severity,
        status: "open",
      });

      createdAlerts.push(alert);
    }
  }

  return createdAlerts;
};

const getAlerts = async () => {
  return AlertEvent.find()
    .populate("ruleId", "name type severity")
    .populate("pipelineId", "name schedule active")
    .populate("runId", "status startedAt finishedAt recordsProcessed errorMessage")
    .sort({ createdAt: -1 });
};

const getAlertById = async (id) => {
  const alert = await AlertEvent.findById(id)
    .populate("ruleId", "name type severity")
    .populate("pipelineId", "name schedule active")
    .populate("runId", "status startedAt finishedAt recordsProcessed errorMessage");

  if (!alert) {
    const error = new Error("Alert not found");
    error.statusCode = 404;
    throw error;
  }

  return alert;
};

module.exports = {
  createFailedRunAlerts,
  createRuntimeExceededAlerts,
  getAlerts,
  getAlertById,
};
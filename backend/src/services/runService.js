const JobRun = require("../models/JobRun");
const JobRunStep = require("../models/JobRunStep");
const alertService = require("./alertService");

const getRuns = async () => {
  return JobRun.find()
    .populate("pipelineId", "name schedule active")
    .populate("pipelineVersionId", "versionNumber config")
    .sort({ startedAt: -1 });
};

const getRunById = async (id) => {
  const run = await JobRun.findById(id)
    .populate("pipelineId", "name schedule active")
    .populate("pipelineVersionId", "versionNumber config");

  if (!run) {
    const error = new Error("Run not found");
    error.statusCode = 404;
    throw error;
  }

  const steps = await JobRunStep.find({ runId: run._id }).sort({ createdAt: 1 });

  return {
    ...run.toObject(),
    steps,
  };
};

const updateRunStatus = async (id, data) => {
  const run = await JobRun.findById(id);

  if (!run) {
    const error = new Error("Run not found");
    error.statusCode = 404;
    throw error;
  }

  if (run.status !== "running") {
    const error = new Error("Only running runs can be finished");
    error.statusCode = 409;
    throw error;
  }

  run.status = data.status;
  run.finishedAt = new Date();
  run.recordsProcessed =
    data.recordsProcessed !== undefined
      ? data.recordsProcessed
      : run.recordsProcessed;
  run.errorMessage = data.status === "failed" ? data.errorMessage : null;

  await run.save();

  if (data.status === "success") {
    await JobRunStep.updateMany(
      { runId: run._id, status: { $in: ["pending", "running"] } },
      {
        status: "success",
        finishedAt: new Date(),
      }
    );
  }

  let createdAlerts = [];

  if (data.status === "failed") {
    const runningStep = await JobRunStep.findOne({
      runId: run._id,
      status: "running",
    });

    if (runningStep) {
      runningStep.status = "failed";
      runningStep.finishedAt = new Date();
      await runningStep.save();
    }

    createdAlerts = await alertService.createFailedRunAlerts(run);
  }

  const updatedRun = await getRunById(run._id);

  return {
    ...updatedRun,
    createdAlerts,
  };
};

module.exports = {
  getRuns,
  getRunById,
  updateRunStatus,
};
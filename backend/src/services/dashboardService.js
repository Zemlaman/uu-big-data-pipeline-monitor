const Dataset = require("../models/Dataset");
const Pipeline = require("../models/Pipeline");
const JobRun = require("../models/JobRun");
const AlertEvent = require("../models/AlertEvent");

const getDashboardSummary = async () => {
  const [
    datasetsCount,
    pipelinesCount,
    activePipelinesCount,
    runsCount,
    failedRunsCount,
    openAlertsCount,
  ] = await Promise.all([
    Dataset.countDocuments(),
    Pipeline.countDocuments(),
    Pipeline.countDocuments({ active: true }),
    JobRun.countDocuments(),
    JobRun.countDocuments({ status: "failed" }),
    AlertEvent.countDocuments({ status: "open" }),
  ]);

  return {
    datasetsCount,
    pipelinesCount,
    activePipelinesCount,
    runsCount,
    failedRunsCount,
    openAlertsCount,
  };
};

module.exports = {
  getDashboardSummary,
};
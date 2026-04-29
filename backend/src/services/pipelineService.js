const Dataset = require("../models/Dataset");
const Pipeline = require("../models/Pipeline");
const PipelineVersion = require("../models/PipelineVersion");
const JobRun = require("../models/JobRun");
const JobRunStep = require("../models/JobRunStep");

const createPipeline = async (data) => {
  const dataset = await Dataset.findById(data.datasetId);

  if (!dataset) {
    const error = new Error("Dataset not found");
    error.statusCode = 404;
    throw error;
  }

  const existingPipeline = await Pipeline.findOne({ name: data.name });

  if (existingPipeline) {
    const error = new Error("Pipeline with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  const pipeline = await Pipeline.create({
    datasetId: data.datasetId,
    name: data.name,
    description: data.description,
    schedule: data.schedule,
    active: data.active !== undefined ? data.active : true,
  });

  await PipelineVersion.create({
    pipelineId: pipeline._id,
    versionNumber: 1,
    config: {
      engine: "simulated",
      steps: ["extract", "transform", "load"],
    },
    active: true,
  });

  return pipeline;
};

const getPipelines = async () => {
  return Pipeline.find()
    .populate("datasetId", "name owner schemaVersion")
    .sort({ createdAt: -1 });
};

const getPipelineById = async (id) => {
  const pipeline = await Pipeline.findById(id).populate(
    "datasetId",
    "name owner description schemaVersion",
  );

  if (!pipeline) {
    const error = new Error("Pipeline not found");
    error.statusCode = 404;
    throw error;
  }

  const activeVersion = await PipelineVersion.findOne({
    pipelineId: pipeline._id,
    active: true,
  });

  return {
    ...pipeline.toObject(),
    activeVersion,
  };
};

const runPipeline = async (pipelineId) => {
  const pipeline = await Pipeline.findById(pipelineId);

  if (!pipeline) {
    const error = new Error("Pipeline not found");
    error.statusCode = 404;
    throw error;
  }

  if (!pipeline.active) {
    const error = new Error("Pipeline is not active");
    error.statusCode = 409;
    throw error;
  }

  const activeVersion = await PipelineVersion.findOne({
    pipelineId: pipeline._id,
    active: true,
  });

  if (!activeVersion) {
    const error = new Error("Active pipeline version not found");
    error.statusCode = 409;
    throw error;
  }

  const run = await JobRun.create({
    pipelineId: pipeline._id,
    pipelineVersionId: activeVersion._id,
    status: "running",
    startedAt: new Date(),
  });

  const steps = activeVersion.config.steps || ["extract", "transform", "load"];

  const stepDocuments = steps.map((stepName, index) => ({
    runId: run._id,
    name: stepName,
    status: index === 0 ? "running" : "pending",
    startedAt: index === 0 ? new Date() : null,
  }));

  await JobRunStep.insertMany(stepDocuments);

  const createdRun = await JobRun.findById(run._id)
    .populate("pipelineId", "name schedule active")
    .populate("pipelineVersionId", "versionNumber config");

  const createdSteps = await JobRunStep.find({ runId: run._id });

  return {
    ...createdRun.toObject(),
    steps: createdSteps,
  };
};

module.exports = {
  createPipeline,
  getPipelines,
  getPipelineById,
  runPipeline,
};

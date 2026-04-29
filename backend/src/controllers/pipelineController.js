const pipelineService = require("../services/pipelineService");
const { validatePipelineInput } = require("../validators/pipelineValidator");

const createPipeline = async (req, res, next) => {
  try {
    const errors = validatePipelineInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const pipeline = await pipelineService.createPipeline(req.body);

    res.status(201).json(pipeline);
  } catch (error) {
    next(error);
  }
};

const getPipelines = async (req, res, next) => {
  try {
    const pipelines = await pipelineService.getPipelines();

    res.status(200).json(pipelines);
  } catch (error) {
    next(error);
  }
};

const getPipelineById = async (req, res, next) => {
  try {
    const pipeline = await pipelineService.getPipelineById(req.params.id);

    res.status(200).json(pipeline);
  } catch (error) {
    next(error);
  }
};

const runPipeline = async (req, res, next) => {
  try {
    const run = await pipelineService.runPipeline(req.params.id);

    res.status(201).json(run);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPipeline,
  getPipelines,
  getPipelineById,
  runPipeline,
};

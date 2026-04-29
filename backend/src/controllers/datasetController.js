const datasetService = require("../services/datasetService");
const { validateDatasetInput } = require("../validators/datasetValidator");

const createDataset = async (req, res, next) => {
  try {
    const errors = validateDatasetInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const dataset = await datasetService.createDataset(req.body);

    res.status(201).json(dataset);
  } catch (error) {
    next(error);
  }
};

const getDatasets = async (req, res, next) => {
  try {
    const datasets = await datasetService.getDatasets();

    res.status(200).json(datasets);
  } catch (error) {
    next(error);
  }
};

const getDatasetById = async (req, res, next) => {
  try {
    const dataset = await datasetService.getDatasetById(req.params.id);

    res.status(200).json(dataset);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDataset,
  getDatasets,
  getDatasetById,
};
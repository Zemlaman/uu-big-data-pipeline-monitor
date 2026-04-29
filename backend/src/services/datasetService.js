const Dataset = require("../models/Dataset");

const createDataset = async (data) => {
  const existingDataset = await Dataset.findOne({ name: data.name });

  if (existingDataset) {
    const error = new Error("Dataset with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  const dataset = await Dataset.create({
    name: data.name,
    description: data.description,
    owner: data.owner,
    schemaVersion: data.schemaVersion || 1,
  });

  return dataset;
};

const getDatasets = async () => {
  return Dataset.find().sort({ createdAt: -1 });
};

const getDatasetById = async (id) => {
  const dataset = await Dataset.findById(id);

  if (!dataset) {
    const error = new Error("Dataset not found");
    error.statusCode = 404;
    throw error;
  }

  return dataset;
};

module.exports = {
  createDataset,
  getDatasets,
  getDatasetById,
};
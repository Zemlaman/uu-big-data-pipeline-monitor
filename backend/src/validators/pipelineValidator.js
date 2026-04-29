const mongoose = require("mongoose");

const validatePipelineInput = (data) => {
  const errors = [];

  if (!data.datasetId || !mongoose.Types.ObjectId.isValid(data.datasetId)) {
    errors.push("Valid datasetId is required");
  }

  if (!data.name || data.name.trim() === "") {
    errors.push("Pipeline name is required");
  }

  if (!data.description || data.description.trim() === "") {
    errors.push("Pipeline description is required");
  }

  if (!data.schedule || data.schedule.trim() === "") {
    errors.push("Pipeline schedule is required");
  }

  if (data.active !== undefined && typeof data.active !== "boolean") {
    errors.push("Active must be a boolean");
  }

  return errors;
};

module.exports = {
  validatePipelineInput,
};
const validateDatasetInput = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Dataset name is required");
  }

  if (!data.description || data.description.trim() === "") {
    errors.push("Dataset description is required");
  }

  if (!data.owner || data.owner.trim() === "") {
    errors.push("Dataset owner is required");
  }

  if (
    data.schemaVersion !== undefined &&
    (!Number.isInteger(data.schemaVersion) || data.schemaVersion < 1)
  ) {
    errors.push("Schema version must be a positive integer");
  }

  return errors;
};

module.exports = {
  validateDatasetInput,
};
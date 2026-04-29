const validateRunStatusUpdate = (data) => {
  const errors = [];
  const allowedStatuses = ["success", "failed"];

  if (!data.status) {
    errors.push("Status is required");
  }

  if (data.status && !allowedStatuses.includes(data.status)) {
    errors.push("Status must be either success or failed");
  }

  if (data.status === "failed" && (!data.errorMessage || data.errorMessage.trim() === "")) {
    errors.push("Error message is required when status is failed");
  }

  if (
    data.recordsProcessed !== undefined &&
    (!Number.isInteger(data.recordsProcessed) || data.recordsProcessed < 0)
  ) {
    errors.push("Records processed must be a non-negative integer");
  }

  return errors;
};

module.exports = {
  validateRunStatusUpdate,
};
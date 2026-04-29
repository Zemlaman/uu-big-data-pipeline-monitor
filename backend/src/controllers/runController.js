const runService = require("../services/runService");
const { validateRunStatusUpdate } = require("../validators/runValidator");

const getRuns = async (req, res, next) => {
  try {
    const runs = await runService.getRuns();

    res.status(200).json(runs);
  } catch (error) {
    next(error);
  }
};

const getRunById = async (req, res, next) => {
  try {
    const run = await runService.getRunById(req.params.id);

    res.status(200).json(run);
  } catch (error) {
    next(error);
  }
};

const updateRunStatus = async (req, res, next) => {
  try {
    const errors = validateRunStatusUpdate(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const run = await runService.updateRunStatus(req.params.id, req.body);

    res.status(200).json(run);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRuns,
  getRunById,
  updateRunStatus,
};
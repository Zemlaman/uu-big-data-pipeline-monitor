const alertService = require("../services/alertService");

const getAlerts = async (req, res, next) => {
  try {
    const alerts = await alertService.getAlerts();

    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};

const getAlertById = async (req, res, next) => {
  try {
    const alert = await alertService.getAlertById(req.params.id);

    res.status(200).json(alert);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlerts,
  getAlertById,
};
const alertRuleService = require("../services/alertRuleService");
const { validateAlertRuleInput } = require("../validators/alertRuleValidator");

const createAlertRule = async (req, res, next) => {
  try {
    const errors = validateAlertRuleInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const alertRule = await alertRuleService.createAlertRule(req.body);

    res.status(201).json(alertRule);
  } catch (error) {
    next(error);
  }
};

const getAlertRules = async (req, res, next) => {
  try {
    const alertRules = await alertRuleService.getAlertRules();

    res.status(200).json(alertRules);
  } catch (error) {
    next(error);
  }
};

const getAlertRuleById = async (req, res, next) => {
  try {
    const alertRule = await alertRuleService.getAlertRuleById(req.params.id);

    res.status(200).json(alertRule);
  } catch (error) {
    next(error);
  }
};

const updateAlertRule = async (req, res, next) => {
  try {
    const alertRule = await alertRuleService.updateAlertRule(req.params.id, req.body);

    res.status(200).json(alertRule);
  } catch (error) {
    next(error);
  }
};

const deleteAlertRule = async (req, res, next) => {
  try {
    const result = await alertRuleService.deleteAlertRule(req.params.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAlertRule,
  getAlertRules,
  getAlertRuleById,
  updateAlertRule,
  deleteAlertRule,
};
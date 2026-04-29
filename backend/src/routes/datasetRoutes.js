const express = require("express");
const datasetController = require("../controllers/datasetController");

const router = express.Router();

router.post("/", datasetController.createDataset);
router.get("/", datasetController.getDatasets);
router.get("/:id", datasetController.getDatasetById);

module.exports = router;
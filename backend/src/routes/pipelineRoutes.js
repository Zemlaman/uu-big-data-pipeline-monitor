const express = require("express");
const pipelineController = require("../controllers/pipelineController");

const router = express.Router();

router.post("/", pipelineController.createPipeline);
router.get("/", pipelineController.getPipelines);
router.get("/:id", pipelineController.getPipelineById);
router.post("/:id/run", pipelineController.runPipeline);

module.exports = router;
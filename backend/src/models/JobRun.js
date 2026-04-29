const mongoose = require("mongoose");

const jobRunSchema = new mongoose.Schema(
  {
    pipelineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pipeline",
      required: true,
    },
    pipelineVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PipelineVersion",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "running", "success", "failed"],
      default: "running",
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    finishedAt: {
      type: Date,
      default: null,
    },
    recordsProcessed: {
      type: Number,
      default: 0,
      min: 0,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobRun", jobRunSchema);
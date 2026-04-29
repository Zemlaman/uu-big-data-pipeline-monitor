const mongoose = require("mongoose");

const alertEventSchema = new mongoose.Schema(
  {
    ruleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AlertRule",
      required: true,
    },
    pipelineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pipeline",
      required: true,
    },
    runId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobRun",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "high",
    },
    status: {
      type: String,
      enum: ["open", "acknowledged", "resolved"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AlertEvent", alertEventSchema);
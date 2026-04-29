const mongoose = require("mongoose");

const alertRuleSchema = new mongoose.Schema(
  {
    pipelineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pipeline",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["FAILED_RUN", "RUNTIME_EXCEEDED"],
      required: true,
    },
    thresholdMinutes: {
      type: Number,
      default: null,
      min: 1,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "high",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AlertRule", alertRuleSchema);
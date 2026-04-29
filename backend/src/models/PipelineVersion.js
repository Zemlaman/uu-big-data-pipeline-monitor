const mongoose = require("mongoose");

const pipelineVersionSchema = new mongoose.Schema(
  {
    pipelineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pipeline",
      required: true,
    },
    versionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    config: {
      engine: {
        type: String,
        default: "simulated",
      },
      steps: {
        type: [String],
        default: ["extract", "transform", "load"],
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PipelineVersion", pipelineVersionSchema);
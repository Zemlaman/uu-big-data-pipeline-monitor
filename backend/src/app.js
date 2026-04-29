const express = require("express");
const cors = require("cors");

const datasetRoutes = require("./routes/datasetRoutes");
const pipelineRoutes = require("./routes/pipelineRoutes");
const runRoutes = require("./routes/runRoutes");
const alertRuleRoutes = require("./routes/alertRuleRoutes");
const alertRoutes = require("./routes/alertRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Big Data Pipeline Monitor API is running",
  });
});

app.use("/api/datasets", datasetRoutes);
app.use("/api/pipelines", pipelineRoutes);
app.use("/api/runs", runRoutes);
app.use("/api/alert-rules", alertRuleRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

module.exports = app;
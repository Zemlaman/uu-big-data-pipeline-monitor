import { useEffect, useState } from "react";
import { getDatasets } from "../api/datasetApi";
import { createPipeline, getPipelines, runPipeline } from "../api/pipelineApi";
import { Link } from "react-router-dom";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

const initialForm = {
  datasetId: "",
  name: "",
  description: "",
  schedule: "0 2 * * *",
  active: true,
};

function PipelinesPage() {
  const [pipelines, setPipelines] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [runningId, setRunningId] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [pipelineData, datasetData] = await Promise.all([
        getPipelines(),
        getDatasets(),
      ]);

      setPipelines(pipelineData);
      setDatasets(datasetData);

      if (!formData.datasetId && datasetData.length > 0) {
        setFormData((previous) => ({
          ...previous,
          datasetId: datasetData[0]._id,
        }));
      }
    } catch (err) {
      setError("Pipelines could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setFormError("");
      setActionMessage("");

      await createPipeline(formData);

      setFormData({
        ...initialForm,
        datasetId: datasets[0]?._id || "",
      });

      await loadData();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;

      if (apiErrors && apiErrors.length > 0) {
        setFormError(apiErrors.join(", "));
      } else {
        setFormError(
          err.response?.data?.message || "Pipeline could not be created.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRunPipeline = async (pipelineId) => {
    try {
      setRunningId(pipelineId);
      setActionMessage("");

      const run = await runPipeline(pipelineId);

      setActionMessage(`Pipeline was started. New run status: ${run.status}.`);
      await loadData();
    } catch (err) {
      setActionMessage(
        err.response?.data?.message || "Pipeline could not be started.",
      );
    } finally {
      setRunningId("");
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Pipelines</h1>
          <p>Manage processing pipelines and start simulated runs.</p>
        </div>

        <button className="secondary-button" onClick={loadData}>
          Refresh
        </button>
      </div>

      {actionMessage && <div className="info-message">{actionMessage}</div>}

      <div className="content-grid">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2>Create pipeline</h2>

          {formError && <div className="form-error">{formError}</div>}

          <label>
            Dataset
            <select
              name="datasetId"
              value={formData.datasetId}
              onChange={handleChange}
            >
              {datasets.map((dataset) => (
                <option key={dataset._id} value={dataset._id}>
                  {dataset.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Name
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="daily_aggregation"
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Daily aggregation of customer transactions"
              rows="4"
            />
          </label>

          <label>
            Schedule
            <input
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="0 2 * * *"
            />
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            Active pipeline
          </label>

          <button
            className="primary-button"
            type="submit"
            disabled={saving || datasets.length === 0}
          >
            {saving ? "Creating..." : "Create pipeline"}
          </button>

          {datasets.length === 0 && (
            <p className="hint-text">Create at least one dataset first.</p>
          )}
        </form>

        <div className="card table-card">
          <h2>Pipeline list</h2>

          {loading && <LoadingState />}

          {!loading && error && <ErrorState message={error} />}

          {!loading && !error && pipelines.length === 0 && (
            <EmptyState message="No pipelines have been created yet." />
          )}

          {!loading && !error && pipelines.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Dataset</th>
                    <th>Schedule</th>
                    <th>Active</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pipelines.map((pipeline) => (
                    <tr key={pipeline._id}>
                      <td>
                        <Link
                          className="table-link"
                          to={`/pipelines/${pipeline._id}`}
                        >
                          {pipeline.name}
                        </Link>
                      </td>
                      <td>{pipeline.datasetId?.name || "Unknown dataset"}</td>
                      <td>{pipeline.schedule}</td>
                      <td>
                        <StatusBadge
                          status={pipeline.active ? "active" : "inactive"}
                        />
                      </td>
                      <td>
                        <button
                          className="small-button"
                          onClick={() => handleRunPipeline(pipeline._id)}
                          disabled={
                            !pipeline.active || runningId === pipeline._id
                          }
                        >
                          {runningId === pipeline._id
                            ? "Starting..."
                            : "Run pipeline"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PipelinesPage;

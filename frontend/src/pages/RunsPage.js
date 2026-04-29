import { useEffect, useMemo, useState } from "react";
import { getRuns, updateRunStatus } from "../api/runApi";
import { Link } from "react-router-dom";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

function RunsPage() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [filters, setFilters] = useState({
    pipelineId: "all",
    status: "all",
    dateFrom: "",
  });

  const loadRuns = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRuns();
      setRuns(data);
    } catch (err) {
      setError("Runs could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRuns();
  }, []);

  const handleMarkSuccess = async (runId) => {
    try {
      setUpdatingId(runId);
      setActionMessage("");

      await updateRunStatus(runId, {
        status: "success",
        recordsProcessed: 152340,
      });

      setActionMessage("Run was successfully finished.");
      await loadRuns();
    } catch (err) {
      setActionMessage(
        err.response?.data?.message || "Run could not be updated.",
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleMarkFailed = async (runId) => {
    const errorMessage = window.prompt(
      "Enter error message for failed run:",
      "Transformation step failed because input schema is invalid",
    );

    if (!errorMessage) {
      return;
    }

    try {
      setUpdatingId(runId);
      setActionMessage("");

      await updateRunStatus(runId, {
        status: "failed",
        recordsProcessed: 4200,
        errorMessage,
      });

      setActionMessage(
        "Run was marked as failed and alert was created if rule exists.",
      );
      await loadRuns();
    } catch (err) {
      setActionMessage(
        err.response?.data?.message || "Run could not be updated.",
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      pipelineId: "all",
      status: "all",
      dateFrom: "",
    });
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  };

  const calculateRuntime = (startedAt, finishedAt) => {
    if (!startedAt) {
      return "-";
    }

    const start = new Date(startedAt).getTime();
    const end = finishedAt ? new Date(finishedAt).getTime() : Date.now();
    const seconds = Math.round((end - start) / 1000);

    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  const pipelinesForFilter = useMemo(() => {
    const uniquePipelines = new Map();

    runs.forEach((run) => {
      if (run.pipelineId?._id) {
        uniquePipelines.set(run.pipelineId._id, run.pipelineId.name);
      }
    });

    return Array.from(uniquePipelines.entries()).map(([pipelineId, name]) => ({
      pipelineId,
      name,
    }));
  }, [runs]);

  const filteredRuns = useMemo(() => {
    return runs.filter((run) => {
      const matchesPipeline =
        filters.pipelineId === "all" || run.pipelineId?._id === filters.pipelineId;

      const matchesStatus =
        filters.status === "all" || run.status === filters.status;

      const matchesDate =
        !filters.dateFrom ||
        new Date(run.startedAt).getTime() >=
          new Date(`${filters.dateFrom}T00:00:00`).getTime();

      return matchesPipeline && matchesStatus && matchesDate;
    });
  }, [runs, filters]);

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Runs</h1>
          <p>Monitor pipeline executions and update simulated run results.</p>
        </div>

        <button className="secondary-button" onClick={loadRuns}>
          Refresh
        </button>
      </div>

      {actionMessage && <div className="info-message">{actionMessage}</div>}

      <div className="card filter-card">
        <h2>Filters</h2>

        <div className="filter-grid">
          <label>
            Pipeline
            <select
              name="pipelineId"
              value={filters.pipelineId}
              onChange={handleFilterChange}
            >
              <option value="all">All pipelines</option>
              {pipelinesForFilter.map((pipeline) => (
                <option key={pipeline.pipelineId} value={pipeline.pipelineId}>
                  {pipeline.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">All statuses</option>
              <option value="running">Running</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </label>

          <label>
            Started from
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
          </label>

          <div className="filter-actions">
            <button className="secondary-button" type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        </div>
      </div>

      <div className="card table-card">
        <h2>Run list</h2>

        {loading && <LoadingState />}

        {!loading && error && <ErrorState message={error} />}

        {!loading && !error && runs.length === 0 && (
          <EmptyState message="No runs have been created yet. Start a pipeline first." />
        )}

        {!loading && !error && runs.length > 0 && filteredRuns.length === 0 && (
          <EmptyState message="No runs match the selected filters." />
        )}

        {!loading && !error && filteredRuns.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Pipeline</th>
                  <th>Status</th>
                  <th>Started at</th>
                  <th>Finished at</th>
                  <th>Runtime</th>
                  <th>Records</th>
                  <th>Error</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRuns.map((run) => (
                  <tr key={run._id}>
                    <td>
                      <Link className="table-link" to={`/runs/${run._id}`}>
                        {run.pipelineId?.name || "Unknown pipeline"}
                      </Link>
                    </td>
                    <td>
                      <StatusBadge status={run.status} />
                    </td>
                    <td>{formatDate(run.startedAt)}</td>
                    <td>{formatDate(run.finishedAt)}</td>
                    <td>{calculateRuntime(run.startedAt, run.finishedAt)}</td>
                    <td>{run.recordsProcessed}</td>
                    <td>{run.errorMessage || "-"}</td>
                    <td>
                      {run.status === "running" ? (
                        <div className="table-actions">
                          <button
                            className="small-button success-button"
                            onClick={() => handleMarkSuccess(run._id)}
                            disabled={updatingId === run._id}
                          >
                            Success
                          </button>

                          <button
                            className="small-button danger-button"
                            onClick={() => handleMarkFailed(run._id)}
                            disabled={updatingId === run._id}
                          >
                            Failed
                          </button>
                        </div>
                      ) : (
                        <span className="muted-text">Finished</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default RunsPage;
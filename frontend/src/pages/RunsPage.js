import { useEffect, useState } from "react";
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

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  };

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

      <div className="card table-card">
        <h2>Run list</h2>

        {loading && <LoadingState />}

        {!loading && error && <ErrorState message={error} />}

        {!loading && !error && runs.length === 0 && (
          <EmptyState message="No runs have been created yet. Start a pipeline first." />
        )}

        {!loading && !error && runs.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Pipeline</th>
                  <th>Status</th>
                  <th>Started at</th>
                  <th>Finished at</th>
                  <th>Records</th>
                  <th>Error</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {runs.map((run) => (
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

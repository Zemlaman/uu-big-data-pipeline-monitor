import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRunById, updateRunStatus } from "../api/runApi";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

function RunDetailPage() {
  const { id } = useParams();

  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadRun = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRunById(id);
      setRun(data);
    } catch (err) {
      setError("Run detail could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleMarkSuccess = async () => {
    try {
      setUpdating(true);
      setActionMessage("");

      await updateRunStatus(id, {
        status: "success",
        recordsProcessed: 152340,
      });

      setActionMessage("Run was successfully finished.");
      await loadRun();
    } catch (err) {
      setActionMessage(err.response?.data?.message || "Run could not be updated.");
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkFailed = async () => {
    const errorMessage = window.prompt(
      "Enter error message for failed run:",
      "Transformation step failed because input schema is invalid"
    );

    if (!errorMessage) {
      return;
    }

    try {
      setUpdating(true);
      setActionMessage("");

      await updateRunStatus(id, {
        status: "failed",
        recordsProcessed: 4200,
        errorMessage,
      });

      setActionMessage("Run was marked as failed and alert was created if rule exists.");
      await loadRun();
    } catch (err) {
      setActionMessage(err.response?.data?.message || "Run could not be updated.");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  };

  const runtime = useMemo(() => {
    if (!run?.startedAt) {
      return "-";
    }

    const start = new Date(run.startedAt).getTime();
    const end = run.finishedAt ? new Date(run.finishedAt).getTime() : Date.now();
    const seconds = Math.round((end - start) / 1000);

    return `${seconds} seconds`;
  }, [run]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!run) {
    return <EmptyState message="Run was not found." />;
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <Link className="back-link" to="/runs">
            ← Back to runs
          </Link>
          <h1>Run detail</h1>
          <p>
            Pipeline execution detail for{" "}
            <strong>{run.pipelineId?.name || "Unknown pipeline"}</strong>.
          </p>
        </div>

        {run.status === "running" && (
          <div className="table-actions">
            <button
              className="small-button success-button"
              onClick={handleMarkSuccess}
              disabled={updating}
            >
              Mark success
            </button>

            <button
              className="small-button danger-button"
              onClick={handleMarkFailed}
              disabled={updating}
            >
              Mark failed
            </button>
          </div>
        )}
      </div>

      {actionMessage && <div className="info-message">{actionMessage}</div>}

      <div className="detail-grid">
        <div className="card">
          <h2>Run metadata</h2>

          <div className="detail-list">
            <div>
              <span>Status</span>
              <strong>
                <StatusBadge status={run.status} />
              </strong>
            </div>

            <div>
              <span>Pipeline</span>
              <strong>{run.pipelineId?.name || "-"}</strong>
            </div>

            <div>
              <span>Pipeline version</span>
              <strong>{run.pipelineVersionId?.versionNumber || "-"}</strong>
            </div>

            <div>
              <span>Engine</span>
              <strong>{run.pipelineVersionId?.config?.engine || "-"}</strong>
            </div>

            <div>
              <span>Runtime</span>
              <strong>{runtime}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Execution result</h2>

          <div className="detail-list">
            <div>
              <span>Started at</span>
              <strong>{formatDate(run.startedAt)}</strong>
            </div>

            <div>
              <span>Finished at</span>
              <strong>{formatDate(run.finishedAt)}</strong>
            </div>

            <div>
              <span>Records processed</span>
              <strong>{run.recordsProcessed}</strong>
            </div>

            <div>
              <span>Error message</span>
              <strong>{run.errorMessage || "-"}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card table-card">
        <h2>Run steps</h2>

        {!run.steps || run.steps.length === 0 ? (
          <EmptyState message="No steps found for this run." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Status</th>
                  <th>Started at</th>
                  <th>Finished at</th>
                </tr>
              </thead>

              <tbody>
                {run.steps.map((step) => (
                  <tr key={step._id}>
                    <td>{step.name}</td>
                    <td>
                      <StatusBadge status={step.status} />
                    </td>
                    <td>{formatDate(step.startedAt)}</td>
                    <td>{formatDate(step.finishedAt)}</td>
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

export default RunDetailPage;
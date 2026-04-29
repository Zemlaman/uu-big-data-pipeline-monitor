import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRuns } from "../api/runApi";
import { getPipelineById, runPipeline } from "../api/pipelineApi";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

function PipelineDetailPage() {
  const { id } = useParams();

  const [pipeline, setPipeline] = useState(null);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [pipelineData, runsData] = await Promise.all([
        getPipelineById(id),
        getRuns(),
      ]);

      setPipeline(pipelineData);
      setRuns(runsData.filter((run) => run.pipelineId?._id === id));
    } catch (err) {
      setError("Pipeline detail could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRunPipeline = async () => {
    try {
      setRunning(true);
      setActionMessage("");

      const run = await runPipeline(id);

      setActionMessage(`Pipeline was started. New run status: ${run.status}.`);
      await loadData();
    } catch (err) {
      setActionMessage(err.response?.data?.message || "Pipeline could not be started.");
    } finally {
      setRunning(false);
    }
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  };

  const statistics = useMemo(() => {
    const successRuns = runs.filter((run) => run.status === "success").length;
    const failedRuns = runs.filter((run) => run.status === "failed").length;
    const runningRuns = runs.filter((run) => run.status === "running").length;

    return {
      totalRuns: runs.length,
      successRuns,
      failedRuns,
      runningRuns,
    };
  }, [runs]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!pipeline) {
    return <EmptyState message="Pipeline was not found." />;
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <Link className="back-link" to="/pipelines">
            ← Back to pipelines
          </Link>
          <h1>{pipeline.name}</h1>
          <p>{pipeline.description}</p>
        </div>

        <button
          className="primary-button"
          onClick={handleRunPipeline}
          disabled={!pipeline.active || running}
        >
          {running ? "Starting..." : "Run pipeline"}
        </button>
      </div>

      {actionMessage && <div className="info-message">{actionMessage}</div>}

      <div className="detail-grid">
        <div className="card">
          <h2>Pipeline metadata</h2>

          <div className="detail-list">
            <div>
              <span>Dataset</span>
              <strong>{pipeline.datasetId?.name || "Unknown dataset"}</strong>
            </div>

            <div>
              <span>Dataset owner</span>
              <strong>{pipeline.datasetId?.owner || "-"}</strong>
            </div>

            <div>
              <span>Schedule</span>
              <strong>{pipeline.schedule}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                <StatusBadge status={pipeline.active ? "active" : "inactive"} />
              </strong>
            </div>

            <div>
              <span>Created at</span>
              <strong>{formatDate(pipeline.createdAt)}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Active version</h2>

          {pipeline.activeVersion ? (
            <div className="detail-list">
              <div>
                <span>Version number</span>
                <strong>{pipeline.activeVersion.versionNumber}</strong>
              </div>

              <div>
                <span>Engine</span>
                <strong>{pipeline.activeVersion.config?.engine || "-"}</strong>
              </div>

              <div>
                <span>Steps</span>
                <strong>
                  {(pipeline.activeVersion.config?.steps || []).join(" → ")}
                </strong>
              </div>
            </div>
          ) : (
            <EmptyState message="No active version found." />
          )}
        </div>
      </div>

      <div className="summary-grid compact-summary">
        <div className="summary-card">
          <span>Total runs</span>
          <strong>{statistics.totalRuns}</strong>
        </div>

        <div className="summary-card">
          <span>Running</span>
          <strong>{statistics.runningRuns}</strong>
        </div>

        <div className="summary-card">
          <span>Success</span>
          <strong>{statistics.successRuns}</strong>
        </div>

        <div className="summary-card">
          <span>Failed</span>
          <strong>{statistics.failedRuns}</strong>
        </div>
      </div>

      <div className="card table-card">
        <h2>Pipeline runs</h2>

        {runs.length === 0 ? (
          <EmptyState message="This pipeline has no runs yet." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Started at</th>
                  <th>Finished at</th>
                  <th>Records</th>
                  <th>Error</th>
                </tr>
              </thead>

              <tbody>
                {runs.map((run) => (
                  <tr key={run._id}>
                    <td>
                      <StatusBadge status={run.status} />
                    </td>
                    <td>{formatDate(run.startedAt)}</td>
                    <td>{formatDate(run.finishedAt)}</td>
                    <td>{run.recordsProcessed}</td>
                    <td>{run.errorMessage || "-"}</td>
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

export default PipelineDetailPage;
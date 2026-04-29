import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAlertById } from "../api/alertApi";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

function AlertDetailPage() {
  const { id } = useParams();

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlert = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAlertById(id);
      setAlert(data);
    } catch (err) {
      setError("Alert detail could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!alert) {
    return <EmptyState message="Alert was not found." />;
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <Link className="back-link" to="/alerts">
            ← Back to alerts
          </Link>
          <h1>Alert detail</h1>
          <p>{alert.message}</p>
        </div>
      </div>

      <div className="detail-grid">
        <div className="card">
          <h2>Incident</h2>

          <div className="detail-list">
            <div>
              <span>Status</span>
              <strong>
                <StatusBadge status={alert.status} />
              </strong>
            </div>

            <div>
              <span>Severity</span>
              <strong>
                <StatusBadge status={alert.severity} />
              </strong>
            </div>

            <div>
              <span>Message</span>
              <strong>{alert.message}</strong>
            </div>

            <div>
              <span>Created at</span>
              <strong>{formatDate(alert.createdAt)}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Rule</h2>

          <div className="detail-list">
            <div>
              <span>Rule name</span>
              <strong>{alert.ruleId?.name || "-"}</strong>
            </div>

            <div>
              <span>Rule type</span>
              <strong>{alert.ruleId?.type || "-"}</strong>
            </div>

            <div>
              <span>Rule severity</span>
              <strong>
                <StatusBadge status={alert.ruleId?.severity || alert.severity} />
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="card">
          <h2>Pipeline</h2>

          <div className="detail-list">
            <div>
              <span>Name</span>
              <strong>{alert.pipelineId?.name || "-"}</strong>
            </div>

            <div>
              <span>Schedule</span>
              <strong>{alert.pipelineId?.schedule || "-"}</strong>
            </div>

            <div>
              <span>Active</span>
              <strong>
                <StatusBadge status={alert.pipelineId?.active ? "active" : "inactive"} />
              </strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Related run</h2>

          <div className="detail-list">
            <div>
              <span>Run status</span>
              <strong>
                <StatusBadge status={alert.runId?.status || "unknown"} />
              </strong>
            </div>

            <div>
              <span>Started at</span>
              <strong>{formatDate(alert.runId?.startedAt)}</strong>
            </div>

            <div>
              <span>Finished at</span>
              <strong>{formatDate(alert.runId?.finishedAt)}</strong>
            </div>

            <div>
              <span>Records processed</span>
              <strong>{alert.runId?.recordsProcessed ?? "-"}</strong>
            </div>

            <div>
              <span>Error message</span>
              <strong>{alert.runId?.errorMessage || "-"}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AlertDetailPage;
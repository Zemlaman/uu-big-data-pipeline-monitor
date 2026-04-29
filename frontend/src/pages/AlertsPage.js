import { useEffect, useState } from "react";
import { getAlerts } from "../api/alertApi";
import { Link } from "react-router-dom";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      setError("Alerts could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

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
          <h1>Alerts</h1>
          <p>Monitor incidents created by failed pipeline runs.</p>
        </div>

        <button className="secondary-button" onClick={loadAlerts}>
          Refresh
        </button>
      </div>

      <div className="card table-card">
        <h2>Alert list</h2>

        {loading && <LoadingState />}

        {!loading && error && <ErrorState message={error} />}

        {!loading && !error && alerts.length === 0 && (
          <EmptyState message="No alerts have been created yet." />
        )}

        {!loading && !error && alerts.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Pipeline</th>
                  <th>Rule</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Run status</th>
                  <th>Message</th>
                  <th>Created at</th>
                </tr>
              </thead>

              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert._id}>
                    <td>
                      <Link className="table-link" to={`/alerts/${alert._id}`}>
                        {alert.pipelineId?.name || "Unknown pipeline"}
                      </Link>
                    </td>
                    <td>{alert.ruleId?.name || "Unknown rule"}</td>
                    <td>
                      <StatusBadge status={alert.severity} />
                    </td>
                    <td>
                      <StatusBadge status={alert.status} />
                    </td>
                    <td>
                      <StatusBadge status={alert.runId?.status || "unknown"} />
                    </td>
                    <td>{alert.message}</td>
                    <td>{formatDate(alert.createdAt)}</td>
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

export default AlertsPage;

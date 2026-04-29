import { useEffect, useState } from "react";
import { getDashboardSummary } from "../api/dashboardApi";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError("Dashboard summary could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const cards = [
    { label: "Datasets", value: summary.datasetsCount },
    { label: "Pipelines", value: summary.pipelinesCount },
    { label: "Active pipelines", value: summary.activePipelinesCount },
    { label: "Runs", value: summary.runsCount },
    { label: "Failed runs", value: summary.failedRunsCount },
    { label: "Open alerts", value: summary.openAlertsCount },
  ];

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of datasets, pipelines, runs and alerts.</p>
        </div>

        <button className="secondary-button" onClick={loadSummary}>
          Refresh
        </button>
      </div>

      <div className="summary-grid">
        {cards.map((card) => (
          <div className="summary-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;
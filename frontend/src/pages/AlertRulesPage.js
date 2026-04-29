import { useEffect, useState } from "react";
import { getPipelines } from "../api/pipelineApi";
import {
  createAlertRule,
  deleteAlertRule,
  getAlertRules,
  updateAlertRule,
} from "../api/alertRuleApi";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

const initialForm = {
  pipelineId: "",
  name: "",
  type: "FAILED_RUN",
  thresholdMinutes: 10,
  severity: "high",
  enabled: true,
};

function AlertRulesPage() {
  const [alertRules, setAlertRules] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [rulesData, pipelinesData] = await Promise.all([
        getAlertRules(),
        getPipelines(),
      ]);

      setAlertRules(rulesData);
      setPipelines(pipelinesData);

      if (!formData.pipelineId && pipelinesData.length > 0) {
        setFormData((previous) => ({
          ...previous,
          pipelineId: pipelinesData[0]._id,
        }));
      }
    } catch (err) {
      setError("Alert rules could not be loaded.");
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
      [name]:
        type === "checkbox"
          ? checked
          : name === "thresholdMinutes"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setFormError("");
      setActionMessage("");

      const payload = {
        ...formData,
        thresholdMinutes:
          formData.type === "RUNTIME_EXCEEDED" ? formData.thresholdMinutes : undefined,
      };

      await createAlertRule(payload);

      setFormData({
        ...initialForm,
        pipelineId: pipelines[0]?._id || "",
      });

      setActionMessage("Alert rule was created.");
      await loadData();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;

      if (apiErrors && apiErrors.length > 0) {
        setFormError(apiErrors.join(", "));
      } else {
        setFormError(err.response?.data?.message || "Alert rule could not be created.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async (rule) => {
    try {
      setUpdatingId(rule._id);
      setActionMessage("");

      await updateAlertRule(rule._id, {
        enabled: !rule.enabled,
      });

      setActionMessage("Alert rule was updated.");
      await loadData();
    } catch (err) {
      setActionMessage(err.response?.data?.message || "Alert rule could not be updated.");
    } finally {
      setUpdatingId("");
    }
  };

  const handleDelete = async (ruleId) => {
    const confirmed = window.confirm("Do you really want to delete this alert rule?");

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(ruleId);
      setActionMessage("");

      await deleteAlertRule(ruleId);

      setActionMessage("Alert rule was deleted.");
      await loadData();
    } catch (err) {
      setActionMessage(err.response?.data?.message || "Alert rule could not be deleted.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Alert Rules</h1>
          <p>Define rules that create alerts when pipeline runs fail or exceed limits.</p>
        </div>

        <button className="secondary-button" onClick={loadData}>
          Refresh
        </button>
      </div>

      {actionMessage && <div className="info-message">{actionMessage}</div>}

      <div className="content-grid">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2>Create alert rule</h2>

          {formError && <div className="form-error">{formError}</div>}

          <label>
            Pipeline
            <select
              name="pipelineId"
              value={formData.pipelineId}
              onChange={handleChange}
            >
              {pipelines.map((pipeline) => (
                <option key={pipeline._id} value={pipeline._id}>
                  {pipeline.name}
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
              placeholder="Failed run alert"
            />
          </label>

          <label>
            Type
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="FAILED_RUN">FAILED_RUN</option>
              <option value="RUNTIME_EXCEEDED">RUNTIME_EXCEEDED</option>
            </select>
          </label>

          {formData.type === "RUNTIME_EXCEEDED" && (
            <label>
              Threshold minutes
              <input
                type="number"
                min="1"
                name="thresholdMinutes"
                value={formData.thresholdMinutes}
                onChange={handleChange}
              />
            </label>
          )}

          <label>
            Severity
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="critical">critical</option>
            </select>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="enabled"
              checked={formData.enabled}
              onChange={handleChange}
            />
            Enabled
          </label>

          <button
            className="primary-button"
            type="submit"
            disabled={saving || pipelines.length === 0}
          >
            {saving ? "Creating..." : "Create alert rule"}
          </button>

          {pipelines.length === 0 && (
            <p className="hint-text">Create at least one pipeline first.</p>
          )}
        </form>

        <div className="card table-card">
          <h2>Alert rule list</h2>

          {loading && <LoadingState />}

          {!loading && error && <ErrorState message={error} />}

          {!loading && !error && alertRules.length === 0 && (
            <EmptyState message="No alert rules have been created yet." />
          )}

          {!loading && !error && alertRules.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Pipeline</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Enabled</th>
                    <th>Threshold</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {alertRules.map((rule) => (
                    <tr key={rule._id}>
                      <td>{rule.name}</td>
                      <td>{rule.pipelineId?.name || "Unknown pipeline"}</td>
                      <td>{rule.type}</td>
                      <td>
                        <StatusBadge status={rule.severity} />
                      </td>
                      <td>
                        <StatusBadge status={rule.enabled ? "active" : "inactive"} />
                      </td>
                      <td>
                        {rule.type === "RUNTIME_EXCEEDED"
                          ? `${rule.thresholdMinutes} min`
                          : "-"}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="small-button"
                            onClick={() => handleToggleEnabled(rule)}
                            disabled={updatingId === rule._id}
                          >
                            {rule.enabled ? "Disable" : "Enable"}
                          </button>

                          <button
                            className="small-button danger-button"
                            onClick={() => handleDelete(rule._id)}
                            disabled={updatingId === rule._id}
                          >
                            Delete
                          </button>
                        </div>
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

export default AlertRulesPage;
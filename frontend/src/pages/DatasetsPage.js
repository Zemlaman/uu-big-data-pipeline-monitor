import { useEffect, useState } from "react";
import { createDataset, getDatasets } from "../api/datasetApi";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

const initialForm = {
  name: "",
  description: "",
  owner: "",
  schemaVersion: 1,
};

function DatasetsPage() {
  const [datasets, setDatasets] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const loadDatasets = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDatasets();
      setDatasets(data);
    } catch (err) {
      setError("Datasets could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "schemaVersion" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setFormError("");

      await createDataset(formData);

      setFormData(initialForm);
      await loadDatasets();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;

      if (apiErrors && apiErrors.length > 0) {
        setFormError(apiErrors.join(", "));
      } else {
        setFormError(err.response?.data?.message || "Dataset could not be created.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Datasets</h1>
          <p>Manage metadata of data sources used by pipelines.</p>
        </div>

        <button className="secondary-button" onClick={loadDatasets}>
          Refresh
        </button>
      </div>

      <div className="content-grid">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2>Create dataset</h2>

          {formError && <div className="form-error">{formError}</div>}

          <label>
            Name
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="customer_transactions"
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Customer transactions from e-shop orders"
              rows="4"
            />
          </label>

          <label>
            Owner
            <input
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              placeholder="analytics-team"
            />
          </label>

          <label>
            Schema version
            <input
              type="number"
              min="1"
              name="schemaVersion"
              value={formData.schemaVersion}
              onChange={handleChange}
            />
          </label>

          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create dataset"}
          </button>
        </form>

        <div className="card table-card">
          <h2>Dataset list</h2>

          {loading && <LoadingState />}

          {!loading && error && <ErrorState message={error} />}

          {!loading && !error && datasets.length === 0 && (
            <EmptyState message="No datasets have been created yet." />
          )}

          {!loading && !error && datasets.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Schema version</th>
                    <th>Created at</th>
                  </tr>
                </thead>

                <tbody>
                  {datasets.map((dataset) => (
                    <tr key={dataset._id}>
                      <td>{dataset.name}</td>
                      <td>{dataset.owner}</td>
                      <td>{dataset.schemaVersion}</td>
                      <td>{new Date(dataset.createdAt).toLocaleString()}</td>
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

export default DatasetsPage;
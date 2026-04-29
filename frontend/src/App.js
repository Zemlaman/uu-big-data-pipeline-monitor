import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import DatasetsPage from "./pages/DatasetsPage";
import PipelinesPage from "./pages/PipelinesPage";
import RunsPage from "./pages/RunsPage";
import AlertsPage from "./pages/AlertsPage";
import PipelineDetailPage from "./pages/PipelineDetailPage";
import RunDetailPage from "./pages/RunDetailPage";
import AlertRulesPage from "./pages/AlertRulesPage";
import AlertDetailPage from "./pages/AlertDetailPage";
import "./App.css";

function NotFoundPage() {
  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Page not found</h1>
          <p>The requested page does not exist.</p>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/datasets" element={<DatasetsPage />} />
          <Route path="/pipelines" element={<PipelinesPage />} />
          <Route path="/runs" element={<RunsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/pipelines/:id" element={<PipelineDetailPage />} />
          <Route path="/runs/:id" element={<RunDetailPage />} />
          <Route path="/alert-rules" element={<AlertRulesPage />} />
          <Route path="/alerts/:id" element={<AlertDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
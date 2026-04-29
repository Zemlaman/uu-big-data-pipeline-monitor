import apiClient from "./apiClient";

export const getPipelines = async () => {
  const response = await apiClient.get("/pipelines");
  return response.data;
};

export const getPipelineById = async (pipelineId) => {
  const response = await apiClient.get(`/pipelines/${pipelineId}`);
  return response.data;
};

export const createPipeline = async (pipelineData) => {
  const response = await apiClient.post("/pipelines", pipelineData);
  return response.data;
};

export const runPipeline = async (pipelineId) => {
  const response = await apiClient.post(`/pipelines/${pipelineId}/run`);
  return response.data;
};
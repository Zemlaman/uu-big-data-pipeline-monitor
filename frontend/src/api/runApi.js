import apiClient from "./apiClient";

export const getRuns = async () => {
  const response = await apiClient.get("/runs");
  return response.data;
};

export const getRunById = async (runId) => {
  const response = await apiClient.get(`/runs/${runId}`);
  return response.data;
};

export const updateRunStatus = async (runId, updateData) => {
  const response = await apiClient.patch(`/runs/${runId}`, updateData);
  return response.data;
};
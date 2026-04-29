import apiClient from "./apiClient";

export const getAlerts = async () => {
  const response = await apiClient.get("/alerts");
  return response.data;
};

export const getAlertById = async (alertId) => {
  const response = await apiClient.get(`/alerts/${alertId}`);
  return response.data;
};
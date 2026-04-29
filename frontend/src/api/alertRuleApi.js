import apiClient from "./apiClient";

export const getAlertRules = async () => {
  const response = await apiClient.get("/alert-rules");
  return response.data;
};

export const createAlertRule = async (alertRuleData) => {
  const response = await apiClient.post("/alert-rules", alertRuleData);
  return response.data;
};

export const updateAlertRule = async (alertRuleId, updateData) => {
  const response = await apiClient.patch(`/alert-rules/${alertRuleId}`, updateData);
  return response.data;
};

export const deleteAlertRule = async (alertRuleId) => {
  const response = await apiClient.delete(`/alert-rules/${alertRuleId}`);
  return response.data;
};
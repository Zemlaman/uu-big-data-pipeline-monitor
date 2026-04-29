import apiClient from "./apiClient";

export const getDatasets = async () => {
  const response = await apiClient.get("/datasets");
  return response.data;
};

export const createDataset = async (datasetData) => {
  const response = await apiClient.post("/datasets", datasetData);
  return response.data;
};
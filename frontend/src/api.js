import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getHealth = async () => {
  const res = await axios.get(`${API_URL}/health`);
  return res.data;
};

export const getStats = async () => {
  const res = await axios.get(`${API_URL}/stats`);
  return res.data;
};

export const getModels = async () => {
  const res = await axios.get(`${API_URL}/models`);
  return res.data;
};

export const getModelMetrics = async () => {
  const res = await axios.get(`${API_URL}/model/metrics`);
  return res.data;
};

export const predictTransaction = async (data, modelName = 'Isolation Forest') => {
  const res = await axios.post(`${API_URL}/predict?model_name=${encodeURIComponent(modelName)}`, data);
  return res.data;
};

export const predictBatch = async (file, modelName = 'Isolation Forest') => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`${API_URL}/predict/batch?model_name=${encodeURIComponent(modelName)}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getTransactions = async (params = {}) => {
  const res = await axios.get(`${API_URL}/transactions`, { params });
  return res.data;
};

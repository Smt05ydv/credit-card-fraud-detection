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

export const getModelInfo = async () => {
  const res = await axios.get(`${API_URL}/model-info`);
  return res.data;
};

export const predictTransaction = async (data) => {
  const res = await axios.post(`${API_URL}/predict`, data);
  return res.data;
};

export const predictBatch = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`${API_URL}/predict/batch`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

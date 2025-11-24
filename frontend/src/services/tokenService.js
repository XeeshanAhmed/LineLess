import axios from "./axios/axiosInstance";

const BASE_URL = "/token";

export const getLatestTokenNumber = async (businessId, departmentId) => {
  const res = await axios.get(`${BASE_URL}/getLatestToken/${businessId}/${departmentId}`);
  return res.data.latestTokenNumber;
};

export const generateTokenForUser = async (userId, businessId, departmentId) => {
    const response = await axios.post(`${BASE_URL}/generate`,{ userId, businessId, departmentId },{ withCredentials: true }
    );
    return response.data;
  };

export const getTokenQueue = async (businessId, departmentId) => {
  const res = await axios.get(`${BASE_URL}/queue/${businessId}/${departmentId}`);
  return res.data;
};

export const updateTokenStatus = async (tokenId, status) => {
  const res = await axios.put(`${BASE_URL}/update-status/${tokenId}`, { status });
  return res.data;
};

export const getActiveTokensForUser = async (userId) => {
  const res = await axios.get(`${BASE_URL}/active/${userId}`);
  return res.data;
};

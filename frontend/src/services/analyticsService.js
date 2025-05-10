import axios from "./axios/axiosInstance";

const BASE_URL = "/analytics"; // Base URL for analytics endpoints

// Get token analytics data
export const getTokenAnalytics = async (businessId, departmentId) => {
  const response = await axios.get(`${BASE_URL}/tokens/${businessId}/${departmentId}`);
  return response.data;
};

// Get feedback analytics data
export const getFeedbackAnalytics = async (businessId, departmentId) => {
  const response = await axios.get(`${BASE_URL}/feedback/${businessId}/${departmentId}`);
  return response.data;
};

import axios from "axios";

const BASE_URL = "http://localhost:5000/api/analytics"; // Base URL for analytics endpoints

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

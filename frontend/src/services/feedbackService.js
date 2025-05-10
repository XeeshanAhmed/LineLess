import axios from "./axios/axiosInstance";

const BASE_URL = "/feedback";


export const submitFeedback = async (feedbackData) => {
  const response = await axios.post(`${BASE_URL}/submit`, feedbackData);
  return response.data.feedback;
};


export const getFeedbackForDepartment = async (businessId, departmentId) => {
  const response = await axios.get(`${BASE_URL}/${businessId}/${departmentId}`);
  return response.data;
};

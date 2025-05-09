import axios from "axios";

const BASE_URL = "http://localhost:5000/api/feedback";


export const submitFeedback = async (feedbackData) => {
  const response = await axios.post(`${BASE_URL}/submit`, feedbackData);
  return response.data.feedback;
};


export const getFeedbackForDepartment = async (businessId, departmentId) => {
  const response = await axios.get(`${BASE_URL}/${businessId}/${departmentId}`);
  return response.data;
};

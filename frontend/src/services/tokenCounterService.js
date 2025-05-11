import axios from "./axios/axiosInstance";

export const resetTokenCounter = async (businessId, departmentId) => {
  const response = await axios.post("/token-counter/reset", { businessId, departmentId });
  return response.data;
};

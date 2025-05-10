import axios from "./axios/axiosInstance";

const BASE_URL = "/department";

export const getDepartmentsByBusinessId = async (businessId) => {
  const response = await axios.get(`${BASE_URL}/getDeptByBusinessId/${businessId}`);
  return response.data;
};

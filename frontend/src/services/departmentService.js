import axios from "axios";

const BASE_URL = "http://localhost:5000/api/department";

export const getDepartmentsByBusinessId = async (businessId) => {
  const response = await axios.get(`${BASE_URL}/getDeptByBusinessId/${businessId}`);
  return response.data;
};

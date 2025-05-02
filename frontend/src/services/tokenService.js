import axios from "axios";

const BASE_URL = "http://localhost:5000/api/token";

export const getLatestTokenNumber = async (businessId, departmentId) => {
  const res = await axios.get(`${BASE_URL}/getLatestToken/${businessId}/${departmentId}`);
  return res.data.latestTokenNumber;
};

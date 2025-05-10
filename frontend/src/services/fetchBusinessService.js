import axios from "./axios/axiosInstance";

const BASE_URL = "/business";

export const fetchBusinesses = async () => {
  const response = await axios.get(`${BASE_URL}/list`);
  return response.data;
};

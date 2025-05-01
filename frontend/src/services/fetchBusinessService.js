import axios from "axios";

const BASE_URL = "http://localhost:5000/api/business";

export const fetchBusinesses = async () => {
  const response = await axios.get(`${BASE_URL}/list`);
  return response.data;
};

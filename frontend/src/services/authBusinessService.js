import axios from "axios";

const BASE_URL = "http://localhost:5000/api/businessAuth";

export const loginBusiness = async (data) => {
  const response = await axios.post(`${BASE_URL}/login`, data, {
    withCredentials: true, 
  });
  return response.data;
};

export const signupBusiness = async (data) => {
  const response = await axios.post(`${BASE_URL}/signup`, data);
  return response.data;
};

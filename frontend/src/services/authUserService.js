import axios from "axios";

const BASE_URL = "http://localhost:5000/api/userAuth";

export const loginUser = async (data) => {
    console.log(data);
  const response = await axios.post(`${BASE_URL}/login`, data);
  return response.data;
};

export const signupUser = async (data) => {
    const response = await axios.post(`${BASE_URL}/signup`, data);
    return response.data;
  };
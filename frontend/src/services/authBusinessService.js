import axios from "./axios/axiosInstance";

const BASE_URL = "/businessAuth";

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

export const logoutBusiness = async () => {
  const response = await axios.post(
    `${BASE_URL}/logout`,{},{withCredentials: true,}
  );
  return response.data;
};

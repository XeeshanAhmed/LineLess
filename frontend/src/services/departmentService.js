import axios from "./axios/axiosInstance";

const BASE_URL = "/department";

export const getDepartmentsByBusinessId = async (businessId) => {
  const response = await axios.get(`${BASE_URL}/getDeptByBusinessId/${businessId}`);
  return response.data;
};

export const updateDepartment = async (departmentId, updateData) => {
  const response = await axios.put(`${BASE_URL}/${departmentId}`, updateData);
  return response.data;
};

export const deleteDepartment = async (departmentId) => {
  const response = await axios.delete(`${BASE_URL}/${departmentId}`);
  return response.data;
};

export const createDepartment = async (businessId, name, averageProcessingTime = 0) => {
  const response = await axios.post(`${BASE_URL}/create`, {
    businessId,
    name,
    averageProcessingTime,
  });
  return response.data;
};

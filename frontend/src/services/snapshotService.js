import axios from "./axios/axiosInstance";

const BASE_URL='/snapshot';
export const getSnapshotData = async (businessId, departmentId, userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${businessId}/${departmentId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch snapshot data:", error);
    throw error;
  }
};

import axiosInstance from '../utils/axiosInstace.js';

export const createShortUrl = async (url , slug) => {
  try {
const response = await axiosInstance.post("/api/create", { url, slug:slug||undefined });
    return response.data;
  } catch (error) {
    console.error("Error creating short URL:", error?.response?.data || error.message || error);
        throw new Error(
      error?.response?.data?.message || "Failed to create short URL"
    );
  }
};

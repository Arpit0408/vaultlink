import axiosInstance from "../utils/axiosInstace.js";

export const createVaultShare = async (payload) => {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
  const config = isFormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};

  const response = await axiosInstance.post("/api/vault/share", payload, config);
  return response.data;
};

export const getUserVaultAssets = async () => {
  const response = await axiosInstance.get("/api/urls");
  return response.data?.urls || [];
};

export const getVaultLeads = async (shortcode) => {
  const response = await axiosInstance.get(`/api/vault/${shortcode}/leads`);
  return response.data;
};

export const deleteVaultAsset = async (shortcode) => {
  const response = await axiosInstance.delete(`/api/vault/${shortcode}`);
  return response.data;
};

export const configureShareAsset = async (shortcode, payload) => {
  const response = await axiosInstance.post(`/api/vault/${shortcode}/configure-share`, payload);
  return response.data;
};

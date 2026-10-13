import axiosInstance from "../utils/axiosInstace.js";

export const loginUser = async (email, password) => {
  try {
    const { data } = await axiosInstance.post("/api/auth/login", { email, password });
    if (data?.token && typeof window !== "undefined") {
      localStorage.setItem("vaultlink-token", data.token);
    }
    return data;
  } catch (error) {
    console.error("Error Login:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to Login");
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const { data } = await axiosInstance.post("/api/auth/register", { name, email, password });
    if (data?.token && typeof window !== "undefined") {
      localStorage.setItem("vaultlink-token", data.token);
    }
    return data;
  } catch (error) {
    console.error("Error in Registration:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to Register");
  }
};

export const logOutUser = async () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vaultlink-token");
    }
    const { data } = await axiosInstance.get("/api/auth/logout");
    return data;
  } catch (error) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vaultlink-token");
    }
    console.error("Error Logout:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to Logout");
  }
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/api/auth/me");
  return data;
};

export const getAllUserUrls = async () => {
  const { data } = await axiosInstance.get("/api/urls/urls");
  return data;
};

export const updateUserProfile = async (payload) => {
  const { data } = await axiosInstance.put("/api/auth/me", payload);
  return data;
};
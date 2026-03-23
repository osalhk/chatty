
import apiClient from "../utils/apiClient";

export const authServices = {
    login: async (data: { email: string, password: string }) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

    register: async (data: { fullname: string, username: string, email: string, password: string }) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

   me : async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  }
};
 
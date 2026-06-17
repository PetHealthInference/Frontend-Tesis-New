import type { ForgotPasswordRequest, ForgotPasswordResponse, LoginRequest, LoginResponse } from "../types/auth";
import { storage } from "../utils/storage";
import { api } from "./api";

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await api.post<LoginResponse>("/api/v1/auth/login", payload);
    storage.setToken(data.access_token);
    return data;
  },
  async forgotPassword(payload: ForgotPasswordRequest) {
    try {
      const { data } = await api.post<ForgotPasswordResponse>("/api/v1/auth/forgot-password", payload);
      return data;
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 404 || status === 405 || status === 501 || status == null) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        return {
          message: "Si el correo existe, recibiras instrucciones.",
        };
      }

      throw error;
    }
  },
  logout() {
    storage.clearToken();
  },
  isAuthenticated() {
    return Boolean(storage.getToken());
  },
};

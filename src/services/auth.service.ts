import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/auth";
import type { User } from "../types/user";
import { storage } from "../utils/storage";
import { api } from "./api";

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await api.post<LoginResponse>("/api/v1/auth/login", payload);
    storage.setToken(data.access_token);
    return data;
  },
  async forgotPassword(payload: ForgotPasswordRequest) {
    const { data } = await api.post<ForgotPasswordResponse>("/api/v1/auth/forgot-password", payload);
    return data;
  },
  async resetPassword(payload: ResetPasswordRequest) {
    const { data } = await api.post<ResetPasswordResponse>("/api/v1/auth/reset-password", payload);
    return data;
  },
  async getCurrentUser() {
    const { data } = await api.get<User>("/api/v1/auth/me");
    return data;
  },
  async changePassword(payload: ChangePasswordRequest) {
    const { data } = await api.patch<ChangePasswordResponse>("/api/v1/auth/change-password", payload);
    return data;
  },
  logout() {
    storage.clearToken();
  },
  isAuthenticated() {
    return Boolean(storage.getToken());
  },
};

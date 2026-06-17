import { useCallback, useSyncExternalStore } from "react";
import { authService } from "../services/auth.service";
import type { LoginRequest } from "../types/auth";
import { storage } from "../utils/storage";

const AUTH_EVENT = "vetclinic-auth-change";

function subscribe(callback: () => void) {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return storage.getToken();
}

function decodeToken(token: string | null): { id: number | null; role: string | null } {
  if (!token) {
    return { id: null, role: null };
  }

  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(window.atob(normalizedPayload)) as { sub?: string; role?: string };

    return {
      id: decoded.sub ? Number(decoded.sub) : null,
      role: decoded.role ?? null,
    };
  } catch {
    return { id: null, role: null };
  }
}

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function useAuth() {
  const token = useSyncExternalStore(subscribe, getSnapshot);
  const user = decodeToken(token);

  const login = useCallback(async (payload: LoginRequest) => {
    await authService.login(payload);
    notifyAuthChange();
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    notifyAuthChange();
  }, []);

  return {
    token,
    user,
    role: user.role,
    isAdmin: user.role === "admin",
    isAuthenticated: Boolean(token),
    login,
    logout,
  };
}

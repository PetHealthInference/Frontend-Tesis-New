const TOKEN_STORAGE_KEY = "access_token";

export const storage = {
  getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};

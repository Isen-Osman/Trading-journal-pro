import { api } from "@/src/lib/api";
import { setToken } from "@/src/lib/auth";

export async function login(username: string, password: string) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const res = await api.post("/auth/login", formData);
  setToken(res.data.access_token);
}

export async function register(username: string, email: string, password: string) {
  const res = await api.post("/auth/register", {
    username,
    email,
    password,
  });

  return res.data;
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
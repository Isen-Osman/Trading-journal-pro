import { api } from "@/src/lib/api";
import { setToken } from "@/src/lib/auth";

export async function login(username: string, password: string) {
  const res = await api.post("/auth/login", {
    username,
    password,
  });

  setToken(res.data.access_token);
}
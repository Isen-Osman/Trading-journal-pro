import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Auth
export async function register(username: string, email: string, password: string) {
    const res = await api.post("/auth/register", {
        username,
        email,
        password,
    });

    return res.data;
}

// Trades
export async function getTrades() {
    const res = await api.get("/trades/");
    return res.data;
}

export async function createTrade(tradeData: any) {
    const res = await api.post("/trades/", tradeData);
    return res.data;
}

// Analytics
export async function getAnalyticsSummary() {
    const res = await api.get("/analytics/summary");
    return res.data;
}
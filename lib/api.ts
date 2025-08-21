// lib/api.ts
import { Platform } from "react-native";

/** ---------- Shared DTOs (keep in sync with backend) ---------- */
export type AddUserRequest = {
  userName: string;
  password: string;
  score?: number;
};

export type AddScoreRequest = { value: number };

export type UserPublic = {
  id: string;
  userName: string;
  bestScore?: number;
};

export type ScoreRow = {
  userId: string;
  userName: string;
  value: number;
  createdAt?: string;
};

/** ---------- Base URL resolution ---------- */
function resolveBaseURL(): string {
  const env = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (env && env.length > 0) return env;

  // Sensible fallbacks for local dev
  //   if (Platform.OS === "android") {
  //     // Android emulator maps "localhost" to the emulator device; host is 10.0.2.2
  //     return "http://10.0.2.2:3000";
  //   }
  return "http://localhost:3000";
}

/** ---------- Minimal fetch-based API client ---------- */
export class Api {
  private baseURL: string;

  constructor(baseURL: string = resolveBaseURL()) {
    this.baseURL = baseURL;
    if (!process.env.EXPO_PUBLIC_API_URL) {
      console.warn(
        `[Api] EXPO_PUBLIC_API_URL is not set. Using fallback "${this.baseURL}". ` +
          `Set EXPO_PUBLIC_API_URL for physical devices or custom hosts.`
      );
    }
  }

  private async request<T = any>(path: string, init?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${path}`;
    console.debug("[Api] Request:", url);
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      ...init,
    });

    console.debug("[Api] Response:", res);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `HTTP ${res.status} ${res.statusText} for ${path}${
          text ? ` — ${text}` : ""
        }`
      );
    }

    const type = res.headers.get("content-type") || "";
    return (
      type.includes("application/json") ? res.json() : (res.text() as any)
    ) as T;
  }

  /** ---------- Endpoints ---------- */
  health(): Promise<any> {
    console.log("[Api] Health check");
    return this.request("/__debug");
  }

  addUser(body: AddUserRequest): Promise<UserPublic[]> {
    return this.request("/adduser", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  addScore(
    userName: string,
    body: AddScoreRequest
  ): Promise<{ userId: string; value: number }> {
    return this.request(`/users/${encodeURIComponent(userName)}/scores`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  listUsers(): Promise<UserPublic[]> {
    return this.request("/users");
  }

  topScores(limit = 10): Promise<ScoreRow[]> {
    return this.request(`/scores/top?limit=${limit}`);
  }

  bottomScores(limit = 10): Promise<{ limit: number; scores: ScoreRow[] }> {
    return this.request(`/scores/bottom?limit=${limit}`);
  }

  compareScore(value: number): Promise<any> {
    return this.request("/scores/compare", {
      method: "POST",
      body: JSON.stringify({ value }),
    });
  }
}

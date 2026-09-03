// lib/api.ts
import { getRandomQuery } from "@/helpers/queries";
import { createImageDataArray } from "@/helpers/unsplash-photo";
import {
  CompareScoreApiType,
  UnsplashImageData,
  UnsplashResponse,
} from "@/types";

/** ---------- Shared DTOs ---------- */
export type AddUserRequest = {
  userName: string;
  email?: string;
  score?: number;
};
export type AddScoreRequest = { value: number };
export type UserPublic = {
  id: string;
  userName: string;
  bestScore?: number;
  email?: string;
};
export type AddUserResponse =
  | UserPublic[]
  | { recognized: true; user: UserPublic };
export type ScoreRow = {
  score: number;
  user: {
    _id: string;
    userName: string;
    createdAt?: number;
    updatedAt?: number;
  };
};

/** ---------- Base URL ---------- */
function resolveBaseURL(): string {
  const env = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (env && env.length > 0) return env;
  return "http://localhost:3000";
}

/** ---------- Generic safeFetch wrapper ---------- */
async function safeFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${resolveBaseURL()}${path}`;
  console.debug(
    "[Api] Fetch",
    options.method ?? "GET",
    url,
    options.body ? JSON.parse(options.body.toString()) : "",
  );

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `HTTP ${res.status} ${res.statusText} for "${path}"${
          text ? ` — ${text}` : ""
        }`,
      );
    }

    console.debug("[Api] Response available");
    return (await res.json()) as T;
  } catch (err: any) {
    console.error("[Api] Error on", path, err);
    throw err;
  }
}

/** ---------- Api client with module-level singleton ---------- */
export class Api {
  health(): Promise<any> {
    return safeFetch("/__debug", { method: "GET" });
  }

  addUser(body: AddUserRequest): Promise<AddUserResponse> {
    return safeFetch<AddUserResponse>("/adduser", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  addScore(
    userName: string,
    body: AddScoreRequest,
  ): Promise<{ userId: string; value: number }> {
    const path = `/users/${encodeURIComponent(userName)}/scores`;
    return safeFetch<{ userId: string; value: number }>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  listUsers(): Promise<UserPublic[]> {
    return safeFetch<UserPublic[]>("/users");
  }

  /** Returns null on a 404 (no user with that email) rather than throwing. */
  async findUserByEmail(email: string): Promise<UserPublic | null> {
    try {
      return await safeFetch<UserPublic>(
        `/users/lookup?email=${encodeURIComponent(email)}`,
      );
    } catch (err: any) {
      if (String(err?.message).includes("HTTP 404")) return null;
      throw err;
    }
  }

  topScores(limit = 10): Promise<ScoreRow[]> {
    return safeFetch<ScoreRow[]>(`/scores/top?limit=${limit}`);
  }

  bottomScores(limit = 10): Promise<{ limit: number; scores: ScoreRow[] }> {
    return safeFetch<{ limit: number; scores: ScoreRow[] }>(
      `/scores/bottom?limit=${limit}`,
    );
  }

  compareScore(value: number): Promise<CompareScoreApiType> {
    return safeFetch<CompareScoreApiType>("/scores/compare", {
      method: "POST",
      body: JSON.stringify({ value }),
    });
  }

  /** Fetch Unsplash images with safeFetch and fallback on error */
  async fetchUnsplashImage(count = 1): Promise<UnsplashImageData[]> {
    try {
      const query = getRandomQuery();
      const path = `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&client_id=${process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY}`;
      console.debug("[Api] UNSPLASH GET", path);

      const res = await fetch(path);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Unsplash HTTP ${res.status} ${res.statusText}${
            text ? ` — ${text}` : ""
          }`,
        );
      }

      const data = (await res.json()) as UnsplashResponse;
      const images = createImageDataArray(data).images;
      return images;
    } catch (err) {
      console.error("[Api] Error fetching Unsplash images:", err);
      return [];
    }
  }
}

/** ---------- Singleton Export ---------- */
export const api = new Api();

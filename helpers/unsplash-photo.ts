import { USE_MOCK, UNSPLASH_APP_NAME } from "@/constants";
import { mockUnsplashApiCall } from "@/mock/promises/unsplash-api-call";
import { UnsplashResponse, UnsplashImageData } from "@/types";
import { getRandomQuery } from "./queries";

// Appends the UTM params required by Unsplash's API attribution guidelines:
// https://help.unsplash.com/en/articles/2511315-guideline-attribution
export function withUnsplashUtm(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}utm_source=${UNSPLASH_APP_NAME}&utm_medium=referral`;
}

export function createImageDataArray(data: UnsplashResponse): {
  images: UnsplashImageData[];
} {
  const images = data.results.map((item) => ({
    id: item.id,
    url: item.urls.regular,
    description: item.description,
    user: item.user.name,
    link: withUnsplashUtm(item.user.links.html),
  }));

  return { images };
}

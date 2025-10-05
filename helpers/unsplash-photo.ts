import { USE_MOCK } from "@/constants";
import { mockUnsplashApiCall } from "@/mock/promises/unsplash-api-call";
import { UnsplashResponse, UnsplashImageData } from "@/types";
import { getRandomQuery } from "./queries";

export function createImageDataArray(data: UnsplashResponse): {
  images: UnsplashImageData[];
} {
  const images = data.results.map((item) => ({
    id: item.id,
    url: item.urls.regular,
    description: item.description,
    user: item.user.name,
    link: item.user.links.html,
  }));

  return { images };
}

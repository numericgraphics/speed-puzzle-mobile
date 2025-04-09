import { UnsplashResponse, UnsplashImageData } from "@/types";

/**
 * Extracts the `regular` URLs from the response and places them
 * into a single object containing a `images` string array.
 */
export function createImageDataArray(data: UnsplashResponse): {
  images: UnsplashImageData[];
} {
  const images = data.results.map((item) => ({
    id: item.id,
    url: item.urls.regular,
    description: item.description,
    user: item.user.name,
    // Adjust if your actual path is different (e.g. `item.user.links.html`)
    link: item.user.links.html,
  }));

  return { images };
}

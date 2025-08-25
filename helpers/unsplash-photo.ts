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

export async function fetchUnsplashImage(
  count = 1,
  isVertical = true
): Promise<UnsplashImageData[]> {
  const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;
  const query = getRandomQuery();
  console.log("fetchUnsplashImage - Query:", query);
  let imagesURL: UnsplashImageData[] = [];
  if (USE_MOCK) {
    const imagesURLTemp = await mockUnsplashApiCall();
    imagesURL = imagesURLTemp.data;
  } else {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&orientation=${
        isVertical ? "portrait" : "landscape"
      }&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = (await response.json()) as UnsplashResponse;
    imagesURL = createImageDataArray(data).images;
  }

  return imagesURL;
}

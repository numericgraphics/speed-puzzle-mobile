/*import { USE_MOCK } from "@/constants";
import { createImageDataArray } from "@/helpers/unsplash-photo";
import {
  MockResponse,
  mockUnsplashApiCall,
} from "@/mock/promises/unsplash-api-call";
import { UnsplashImageData, UnsplashResponse } from "@/types";
import React, { useState, useEffect } from "react";

export function useUnsplash() {
  const [images, setImages] = useState<UnsplashImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;

  const fetchImages = async (query: string, count = 1) => {
    try {
      let imagesURL: UnsplashImageData[] = [];
      if (USE_MOCK) {
        const imagesURLTemp = await mockUnsplashApiCall();
        imagesURL = imagesURLTemp.data;
      } else {
        console.log("useUnsplash - Fetched data");
        const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&client_id=${UNSPLASH_ACCESS_KEY}`;
        console.log("useUnsplash - Fetched data - url", url);
        const response = await fetch(url);
        console.log("useUnsplash - Fetched data - response", response);
        const data = (await response.json()) as UnsplashResponse;
        imagesURL = createImageDataArray(data).images;
      }

      console.log("useUnsplash - Fetched data:", imagesURL);
      if (imagesURL) {
        setImages(imagesURL);
      }
    } catch (error: any) {
      console.error("Error fetching images from Unsplash:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getImage = (id: string) => {
    return images.find((img) => img.id === id);
  };

  useEffect(() => {
    console.log("Fetched images:", images);
  }, [images]);

  return {
    images,
    loading,
    error,
    fetchImages,
    getImage,
  };
}
*/

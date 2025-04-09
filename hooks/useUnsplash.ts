import { mockUnsplashApiCall } from "@/mock/promises/unsplash-api-call";
import { UnsplashImageData } from "@/types";
import React, { useState, useEffect } from "react";

export function useUnsplash() {
  const [images, setImages] = useState<UnsplashImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;

  // Fetch multiple images by query
  const fetchImages = async (query: string, count = 1) => {
    try {
      // const response = await fetch(
      //   `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&client_id=${UNSPLASH_ACCESS_KEY}`
      // );
      // const data = await response.json();
      // const imagesURL = createImageDataArray(data);

      const imagesURL = await mockUnsplashApiCall();
      console.log("Fetched data:", imagesURL);
      if (imagesURL) {
        setImages(imagesURL.data);
      }
    } catch (error: any) {
      console.error("Error fetching images from Unsplash:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Retrieve a single image from the stored array by ID
  const getImage = (id: string) => {
    return images.find((img) => img.id === id);
  };

  // Example fetch on mount
  useEffect(() => {
    setLoading(true);
    fetchImages("forest", 10);
  }, []);

  useEffect(() => {
    console.log("Fetched images:", images);
  }, [images]);

  return {
    images,
    loading,
    error,
    fetchImages,
    getImage, // retrieve a single image from your stored array
  };
}

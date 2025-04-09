/*import { createImageDataArray } from "@/helpers/unsplash-photo";
import { mockUnsplashApiCall } from "@/mock/promises/unsplash-api-call";
import { UnsplashImageData } from "@/types";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useEffect } from "react";

interface UnsplashContextType {
  images: UnsplashImageData[];
  loading: boolean;
  error: string | null;
}

const UnsplashContext = createContext<UnsplashContextType | undefined>(
  undefined
);

const UnsplashProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<UnsplashImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;

  const fetchImages = async (query: string, count = 1) => {
    try {
      //   const response = await fetch(
      //     `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&client_id=${UNSPLASH_ACCESS_KEY}`
      //   );
      //   const data = await response.json();
      //   const imagesURL = createImageDataArray(data);
      const imagesURL = await mockUnsplashApiCall();
      console.log("Fetched data:", imagesURL);
      return imagesURL;
    } catch (error) {
      console.error("Error fetching images from Unsplash:", error);
    }
  };

  useEffect(() => {
    const initializeImages = async () => {
      const imagesURL = await fetchImages("forest", 10);
      if (imagesURL) {
        setImages(imagesURL?.data);
        setLoading(false);
      }
    };
    setLoading(true);
    initializeImages();
  }, []);

  useEffect(() => {
    console.log("Fetched images:", images);
  }, [images]);

  return (
    <UnsplashContext.Provider value={{ images, loading, error }}>
      {children}
    </UnsplashContext.Provider>
  );
};

const useUnsplash = (): UnsplashContextType => {
  const context = useContext(UnsplashContext);
  if (!context) {
    throw new Error("useUnsplash must be used within an UnsplashProvider");
  }
  return context;
};

export { UnsplashProvider, useUnsplash };

*/

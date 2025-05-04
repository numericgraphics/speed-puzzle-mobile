import { UnsplashImageData } from "@/types";
import {
  mockedUnsplashData,
  mockedUnsplashDataLight,
} from "../payload-unsplash-photos";

type MockResponse = {
  success: boolean;
  message: string;
  data: UnsplashImageData[];
};

export async function mockUnsplashApiCall(): Promise<MockResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Mock data fetched successfully",
        data: mockedUnsplashDataLight,
      });
    }, 1500); // Delay in milliseconds to simulate network latency
  });
}

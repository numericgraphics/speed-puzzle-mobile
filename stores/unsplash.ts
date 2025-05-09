import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UnsplashImageData } from "@/types";

interface UnsplashStoreActions {
  fetchImages: (images: UnsplashImageData[]) => Promise<void>;
  getImage: (id: string) => UnsplashImageData | undefined;
  resetImages: () => void;
}

interface UnsplashStoreState {
  images: UnsplashImageData[];
  imageReady: boolean;
  loading: boolean;
  error: string | null;
  actions: UnsplashStoreActions;
}

export const useUnsplashStore = create<UnsplashStoreState>()(
  devtools((set, get) => ({
    images: [],
    loading: false,
    imageReady: false,
    error: null,

    // Put all logic in an `actions` object
    actions: {
      // 1) fetchImages
      fetchImages: (images: UnsplashImageData[]) => {
        console.log("useUnsplashStore fetchImages ");
        set({ error: null });
        // set({ loading: true, error: null });
        try {
          set({
            images,
            imageReady: true,
            loading: false,
          });
        } catch (err: any) {
          console.error("Error fetching images from Unsplash:", err);
          set({ error: err.message, imageReady: false });
        } finally {
          set({ loading: false });
        }
      },

      // 2) getImage
      getImage: (id: string) => {
        const { images } = get();
        return images.find((img) => img.id === id);
      },

      resetImages: () => {
        set({
          images: [],
          imageReady: false,
          loading: false,
          error: null,
        });
      },
    },
  }))
);

/**
 * Helper to access just the actions from the store.
 * For example usage: `const { fetchImages } = useUnsplashStoreActions()`
 */
export const useUnsplashStoreActions = () =>
  useUnsplashStore((state) => state.actions);

interface UnsplashUserLinks {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
  following: string;
  followers: string;
}

interface UnsplashUser {
  id: string;
  username: string;
  name: string;
  links: UnsplashUserLinks;
}

interface UnsplashUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

interface UnsplashResult {
  id: string;
  description: string | null;
  urls: UnsplashUrls;
  user: UnsplashUser;
}

export interface UnsplashResponse {
  total: number;
  total_pages: number;
  results: UnsplashResult[];
}

export interface UnsplashImageData {
  id: string;
  url: string;
  description: string | null;
  user: string;
  link: string;
}

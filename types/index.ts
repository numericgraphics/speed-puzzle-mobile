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

export type PuzzleProviderType = {
  reducer: {
    dispatch: React.Dispatch<MessagingActionType>;
    state: PuzzleStateType;
  };
};

export enum PuzzleComponentType {
  GAME = "game",
  INIT = "init",
  LOADING = "loading",
  RESULT = "result",
}

export type PuzzleResultType = {
  duration: number;
  moves: number;
  complexity: number;
  value: number;
  ranking: boolean;
  ranked: boolean;
};

export type PuzzleStateType = {
  event: string;
  component: PuzzleComponentType;
  challenges: number;
  ordered: boolean;
  complexity: number;
  timerValue: number;
  moves: number;
  loading: boolean;
  scores: ChallengeScoreType[];
  slides?: PuzzlePieceType[];
  url?: string;
  transitionStatus: boolean;
  result?: PuzzleResultType;
};

export enum PuzzleActionType {
  INIT = "init",
  START = "start",
  PLAY = "play",
  END_PRELOADING = "endOfPreLoading",
  READY = "ready",
  LOADING = "loading",
  END_LOADING = "endLoading",
  DONE = "done",
  UPDATE = "update",
  END_GAME = "endGame",
  MOVE = "move",
  RELOAD = "reload",
  OPENED = "opened",
  CLOSED = "closed",
  ORDERED = "ordered",
  RANKING = "ranking",
  RANKED = "ranked",
  NEW_CHALLENGE = "newChallenge",
  CHALLENGE_TIMER_RESULT = "challengeTimerResult",
}

export type MessagingActionType = {
  type: PuzzleActionType;
  payload?: any;
};

export type PuzzlePieceType = {
  id: string;
  index: number;
  content: string;
};

export type ChallengeScoreType = {
  complexity: number;
  timerValue: number;
  moves: number;
};

export type ChallengeGlobalScoreType = {
  duration: number;
  moves: number;
  complexity: number;
  result?: number;
};

export type RegisterForm = {
  userName: string;
  password: string;
  scores: any[];
};

export type UserInformationsType = {
  userName: string;
  password: string;
  score: string;
};

export type RegisterApiType = {
  message: string;
  user: {};
};

export type CompareScoreApiType = {
  isBottom10: boolean;
  threshold: number | null;
  bottom10Count: number;
};

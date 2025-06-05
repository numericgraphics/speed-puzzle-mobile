export enum ROUTES {
  WELCOME = "/welcome",
  GAME = "/game",
  RESULT = "/result",
}

export enum PUZZLE_STEPS {
  INIT = "init",
  READY = "ready",
  LOADING = "loading",
  END_LOADING = "endLoading",
  DONE = "done",
  UPDATE = "update",
  END_GAME = "endGame",
  MOVE = "move",
  RELOAD = "reload",
}

export enum WORDS_RESULT {
  FABULOUS = "fabulous",
  GOOD = "good",
  AVERAGE = "average",
  WRONG = "wrong",
}

export const PUZZLE_SLIDE_NUMBER: number = 4;

export const NUMBER_OF_QUESTION: number = 3;

export const USE_MOCK = false;

export const COUNTER_MESSAGES = Object.freeze({
  START: "start",
  PAUSE: "pause",
  END: "end",
});

export const PUZZLE_COOKIE = "puzzleCookie";

export const DB_NAME = "my-db"; // Turso db name

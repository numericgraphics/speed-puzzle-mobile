import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { api } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import { useResultStore } from "@/stores/results";

const STORAGE_KEY = "@hp:user";

async function loadUser(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

async function saveUser(user: User): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

async function clearUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function isBetterScore(current: number, best: number | null): boolean {
  if (best == null) return true;
  return current > best; // higher is better
}

// --- Types ---
export type SignUpForm = { userName: string };
export type LoginForm = { userName: string; key: string };

type State = {
  visible: boolean;
  submitting: boolean;
  submitError: string | null;
  lastOpenedFor: number | null;
  scoreConfirmVisible: boolean;
  scoreSubmitted: boolean;
  scoreRegisteredForRun: boolean;
  submitted: boolean;
  generatedKey: string | null;
  loginFailed: boolean;
  usernameTaken: boolean;
};

type Action =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS"; key: string }
  | { type: "USERNAME_TAKEN" }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS" }
  | { type: "LOGIN_FAILED" }
  | { type: "OPEN_SCORE_CONFIRM" }
  | { type: "CLOSE_SCORE_CONFIRM" }
  | { type: "SUBMIT_SCORE_START" }
  | { type: "SUBMIT_SCORE_SUCCESS" }
  | { type: "SUBMIT_ERROR"; error: string }
  | { type: "RESET_SCORE_REGISTRATION" };

const initialState: State = {
  visible: false,
  submitting: false,
  submitError: null,
  lastOpenedFor: null,
  scoreConfirmVisible: false,
  scoreSubmitted: false,
  scoreRegisteredForRun: false,
  submitted: false,
  generatedKey: null,
  loginFailed: false,
  usernameTaken: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN": {
      return {
        ...state,
        visible: true,
        submitError: null,
        submitted: false,
        generatedKey: null,
        loginFailed: false,
        usernameTaken: false,
      };
    }
    case "CLOSE":
      return {
        ...state,
        visible: false,
        submitting: false,
        submitError: null,
        submitted: false,
        generatedKey: null,
        loginFailed: false,
        usernameTaken: false,
      };
    case "SUBMIT_START":
      return { ...state, submitting: true, submitError: null, usernameTaken: false };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        submitting: false,
        submitted: true,
        generatedKey: action.key,
        scoreRegisteredForRun: true,
      };
    case "USERNAME_TAKEN":
      return { ...state, submitting: false, usernameTaken: true };
    case "LOGIN_START":
      return { ...state, submitting: true, submitError: null, loginFailed: false };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        submitting: false,
        submitted: true,
        scoreRegisteredForRun: true,
      };
    case "LOGIN_FAILED":
      return { ...state, submitting: false, loginFailed: true };
    case "OPEN_SCORE_CONFIRM":
      return {
        ...state,
        scoreConfirmVisible: true,
        scoreSubmitted: false,
        submitError: null,
      };
    case "CLOSE_SCORE_CONFIRM":
      return {
        ...state,
        scoreConfirmVisible: false,
        submitting: false,
        scoreSubmitted: false,
        submitError: null,
      };
    case "SUBMIT_SCORE_START":
      return { ...state, submitting: true, submitError: null };
    case "SUBMIT_SCORE_SUCCESS":
      return {
        ...state,
        submitting: false,
        scoreSubmitted: true,
        scoreRegisteredForRun: true,
      };
    case "SUBMIT_ERROR":
      return { ...state, submitting: false, submitError: action.error };
    case "RESET_SCORE_REGISTRATION":
      return { ...state, scoreRegisteredForRun: false };
    default:
      return state;
  }
}

// --- Context + hook ---
interface CtxValue {
  state: State;
  open: () => void;
  close: () => void;
  signUp: (form: SignUpForm) => Promise<void>;
  login: (form: LoginForm) => Promise<void>;
  resetScoreRegistration: () => void;
  openScoreConfirm: () => void;
  closeScoreConfirm: () => void;
  submitScoreWithoutModal: () => Promise<void>;
  switchPlayer: () => Promise<void>;
  user: User | null;
}

const Ctx = createContext<CtxValue | null>(null);

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { score } = useResultStore.getState();

  useEffect(() => {
    (async () => {
      const u = await loadUser();
      console.log("Loaded user from storage:", u);
      if (u) setUser(u);
    })();
  }, []);

  const open = useCallback(() => {
    (async () => {
      const u = await loadUser();
      if (u) setUser(u);
      dispatch({ type: "OPEN" });
    })();
  }, []);

  const close = useCallback(() => {
    dispatch({ type: "CLOSE" });
  }, []);

  const resetScoreRegistration = useCallback(() => {
    dispatch({ type: "RESET_SCORE_REGISTRATION" });
  }, []);

  const openScoreConfirm = useCallback(() => {
    dispatch({ type: "OPEN_SCORE_CONFIRM" });
  }, []);

  const closeScoreConfirm = useCallback(() => {
    dispatch({ type: "CLOSE_SCORE_CONFIRM" });
  }, []);

  const submitScoreWithoutModal = useCallback(async (): Promise<void> => {
    if (!user) throw new Error("User not found");
    if (!score) throw new Error("Payload.score not found");
    dispatch({ type: "SUBMIT_SCORE_START" });

    try {
      const currentScore = score;

      const response = await api.addScore(user.userName, {
        value: currentScore,
      });
      const improved = isBetterScore(currentScore, user.bestScore);
      const nextUser: User = {
        id: response.userId || user.id,
        userName: user.userName,
        bestScore: improved ? currentScore : user.bestScore,
      };
      setUser(nextUser);
      await saveUser(nextUser);
      dispatch({ type: "SUBMIT_SCORE_SUCCESS" });
    } catch (e: any) {
      dispatch({
        type: "SUBMIT_ERROR",
        error: e?.message ?? "Could not save your score",
      });
    }
  }, [user, score]);

  /**
   * Create a brand-new player. The server generates and returns a recovery
   * key exactly once here — it is never stored server-side in plaintext and
   * cannot be retrieved again, so the UI must force the user to acknowledge
   * they've saved it before this modal can close.
   */
  const signUp = useCallback(
    async (form: SignUpForm) => {
      try {
        dispatch({ type: "SUBMIT_START" });

        const currentScore = score ?? null;
        const body = {
          userName: form.userName,
          ...(currentScore != null ? { score: currentScore } : {}),
        };

        const result = await api.addUser(body);
        if (!result) {
          dispatch({ type: "USERNAME_TAKEN" });
          return;
        }
        const { user: created, key } = result;

        const nextUser: User = {
          id: created.id,
          userName: created.userName,
          bestScore: currentScore ?? null,
        };
        setUser(nextUser);
        await saveUser(nextUser);
        dispatch({ type: "SUBMIT_SUCCESS", key });
      } catch (e: any) {
        dispatch({
          type: "SUBMIT_ERROR",
          error: e?.message ?? "Sign up failed",
        });
      }
    },
    [score]
  );

  /**
   * Recover a player on this device using their username + recovery key —
   * the only recovery path now that there's no email on file.
   */
  const login = useCallback(async (form: LoginForm) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const found = await api.login({
        userName: form.userName,
        key: form.key,
      });
      if (!found) {
        dispatch({ type: "LOGIN_FAILED" });
        return;
      }
      const nextUser: User = {
        id: found.id,
        userName: found.userName,
        bestScore: found.bestScore ?? null,
      };
      setUser(nextUser);
      await saveUser(nextUser);
      dispatch({ type: "LOGIN_SUCCESS" });
    } catch (e: any) {
      dispatch({
        type: "SUBMIT_ERROR",
        error: e?.message ?? "Login failed",
      });
    }
  }, []);

  /**
   * Forget the player stored on this device, like walking away from the
   * cabinet — the next top-10 score will prompt for a fresh name.
   */
  const switchPlayer = useCallback(async () => {
    setUser(null);
    await clearUser();
  }, []);

  const value = useMemo(
    () => ({
      state,
      open,
      close,
      signUp,
      login,
      resetScoreRegistration,
      openScoreConfirm,
      closeScoreConfirm,
      submitScoreWithoutModal,
      switchPlayer,
      user,
    }),
    [
      state,
      open,
      close,
      signUp,
      login,
      resetScoreRegistration,
      openScoreConfirm,
      closeScoreConfirm,
      submitScoreWithoutModal,
      switchPlayer,
      user,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useRegistration() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useHighScoreModal must be used within HighScoreModalProvider"
    );
  return ctx;
}

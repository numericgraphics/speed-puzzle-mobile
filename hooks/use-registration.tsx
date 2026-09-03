import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { api, UserPublic } from "@/lib/api";
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
export type HighScoreForm = { userName: string; email?: string };

type State = {
  visible: boolean;
  submitting: boolean;
  submitError: string | null;
  lastOpenedFor: number | null;
  scoreConfirmVisible: boolean;
  scoreSubmitted: boolean;
  submitted: boolean;
  recognized: boolean;
};

type Action =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS"; recognized: boolean }
  | { type: "OPEN_SCORE_CONFIRM" }
  | { type: "CLOSE_SCORE_CONFIRM" }
  | { type: "SUBMIT_SCORE_START" }
  | { type: "SUBMIT_SCORE_SUCCESS" }
  | { type: "SUBMIT_ERROR"; error: string };

const initialState: State = {
  visible: false,
  submitting: false,
  submitError: null,
  lastOpenedFor: null,
  scoreConfirmVisible: false,
  scoreSubmitted: false,
  submitted: false,
  recognized: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN": {
      return {
        ...state,
        visible: true,
        submitError: null,
        submitted: false,
        recognized: false,
      };
    }
    case "CLOSE":
      return {
        ...state,
        visible: false,
        submitting: false,
        submitError: null,
        submitted: false,
      };
    case "SUBMIT_START":
      return { ...state, submitting: true, submitError: null };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        submitting: false,
        submitted: true,
        recognized: action.recognized,
      };
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
      return { ...state, submitting: false, scoreSubmitted: true };
    case "SUBMIT_ERROR":
      return { ...state, submitting: false, submitError: action.error };
    default:
      return state;
  }
}

// --- Context + hook ---
interface CtxValue {
  state: State;
  open: () => void;
  close: () => void;
  submit: (form: HighScoreForm) => Promise<void>;
  openScoreConfirm: () => void;
  closeScoreConfirm: () => void;
  submitScoreWithoutModal: () => Promise<void>;
  switchPlayer: () => Promise<void>;
  findUserByEmail: (email: string) => Promise<UserPublic | null>;
  recoverPlayer: (found: UserPublic) => Promise<void>;
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
        email: user.email,
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

  const submit = useCallback(
    async (form: HighScoreForm) => {
      try {
        dispatch({ type: "SUBMIT_START" });

        const currentScore = score ?? null;
        const email = form.email?.trim() || undefined;
        const body = {
          userName: form.userName,
          ...(email ? { email } : {}),
          ...(currentScore != null ? { score: currentScore } : {}),
        };

        const response = await api.addUser(body);

        if (Array.isArray(response)) {
          let created =
            response.find((u) => u.userName === form.userName) || null;
          if (!created) {
            const all = await api.listUsers();
            created = all.find((u) => u.userName === form.userName) || null;
          }
          if (!created)
            throw new Error("User created but could not be resolved");

          const nextUser: User = {
            id: created.id,
            userName: created.userName,
            bestScore: currentScore ?? null,
            email: created.email ?? email ?? null,
          };
          setUser(nextUser);
          await saveUser(nextUser);
          dispatch({ type: "SUBMIT_SUCCESS", recognized: false });
          return;
        }

        // Email matched an existing player — this device now recognizes
        // them too, like re-adding a known name to the cabinet.
        const recognizedUser: User = {
          id: response.user.id,
          userName: response.user.userName,
          bestScore: response.user.bestScore ?? null,
          email: response.user.email ?? email ?? null,
        };
        setUser(recognizedUser);
        await saveUser(recognizedUser);
        dispatch({ type: "SUBMIT_SUCCESS", recognized: true });
      } catch (e: any) {
        dispatch({
          type: "SUBMIT_ERROR",
          error: e?.message ?? "Submit failed",
        });
      }
    },
    [score]
  );

  /**
   * Forget the player stored on this device, like walking away from the
   * cabinet — the next top-10 score will prompt for a fresh name.
   */
  const switchPlayer = useCallback(async () => {
    setUser(null);
    await clearUser();
  }, []);

  /**
   * Look up a player by their recovery email — for a device with no local
   * player at all (fresh install, or after switchPlayer). Returns null if
   * no user has that email on file; throws on a network/server error.
   */
  const findUserByEmail = useCallback(async (email: string) => {
    return api.findUserByEmail(email);
  }, []);

  /**
   * Adopt a looked-up player as this device's local player, mirroring
   * switchPlayer's local-storage effect in the opposite direction.
   */
  const recoverPlayer = useCallback(async (found: UserPublic) => {
    const recovered: User = {
      id: found.id,
      userName: found.userName,
      bestScore: found.bestScore ?? null,
      email: found.email ?? null,
    };
    setUser(recovered);
    await saveUser(recovered);
  }, []);

  const value = useMemo(
    () => ({
      state,
      open,
      close,
      submit,
      openScoreConfirm,
      closeScoreConfirm,
      submitScoreWithoutModal,
      switchPlayer,
      findUserByEmail,
      recoverPlayer,
      user,
    }),
    [
      state,
      open,
      close,
      submit,
      openScoreConfirm,
      closeScoreConfirm,
      submitScoreWithoutModal,
      switchPlayer,
      findUserByEmail,
      recoverPlayer,
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

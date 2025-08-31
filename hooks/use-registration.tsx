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

function isBetterScore(current: number, best: number | null): boolean {
  if (best == null) return true;
  return current < best; // lower is better
}

// --- Types ---
export type HighScoreForm = { userName: string; password: string };

type State = {
  visible: boolean;
  submitting: boolean;
  submitError: string | null;
  lastOpenedFor: number | null;
};

type Action =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_SCORE_START" }
  | { type: "SUBMIT_SCORE_SUCCESS" }
  | { type: "SUBMIT_ERROR"; error: string };

const initialState: State = {
  visible: false,
  submitting: false,
  submitError: null,
  lastOpenedFor: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN": {
      return {
        ...state,
        visible: true,
        submitError: null,
      };
    }
    case "CLOSE":
      return { ...state, visible: false, submitting: false, submitError: null };
    case "SUBMIT_START":
      return { ...state, submitting: true, submitError: null };
    case "SUBMIT_SUCCESS":
      return { ...state, submitting: false, visible: false };
    case "SUBMIT_SCORE_START":
      return { ...state, submitting: true, submitError: null };
    case "SUBMIT_SCORE_SUCCESS":
      return { ...state, submitting: false };
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
  submitScoreWithoutModal: () => Promise<void>;
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

  const submitScoreWithoutModal = useCallback(async (): Promise<void> => {
    if (!user) throw new Error("User not found");
    if (!score) throw new Error("Payload.score not found");
    dispatch({ type: "SUBMIT_SCORE_START" });

    try {
      const currentScore = score;
      console.log("Submitting score without modal:", currentScore);

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
      console.log("Score submitted:", response);
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  }, [user]);

  const submit = useCallback(
    async (form: HighScoreForm) => {
      try {
        dispatch({ type: "SUBMIT_START" });
        // const valid = (s: string) =>
        //   s.length >= 4 && s.length <= 9 && /^\S+$/.test(s);
        // if (!valid(form.userName) || !valid(form.password)) {
        //   throw new Error("Username and password must be 4–9 chars, no spaces");
        // }

        console.log("Submitting registration for", form);
        console.log("Submitting state", state);
        console.log("Submitting User", user);

        const currentScore = score ?? null;

        const body =
          currentScore != null
            ? {
                userName: form.userName,
                password: form.password,
                score: currentScore,
              }
            : { userName: form.userName, password: form.password };

        const list = await api.addUser(body as any);
        let created = list.find((u) => u.userName === form.userName) || null;
        if (!created) {
          const all = await api.listUsers();
          created = all.find((u) => u.userName === form.userName) || null;
        }
        if (!created) throw new Error("User created but could not be resolved");

        const nextUser: User = {
          id: created.id,
          userName: created.userName,
          bestScore: currentScore ?? null,
        };
        setUser(nextUser);
        await saveUser(nextUser);
        dispatch({ type: "SUBMIT_SUCCESS" });
      } catch (e: any) {
        dispatch({
          type: "SUBMIT_ERROR",
          error: e?.message ?? "Submit failed",
        });
      }
    },
    [score, user]
  );

  const value = useMemo(
    () => ({ state, open, close, submit, submitScoreWithoutModal, user }),
    [state, open, close, submit, submitScoreWithoutModal, user]
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

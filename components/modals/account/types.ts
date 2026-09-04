import { SignUpForm, LoginForm } from "@/hooks/use-registration";
import { User } from "@/types";

export type AccountModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  user: User | null;
  submitting: boolean;
  submitted: boolean;
  generatedKey: string | null;
  loginFailed: boolean;
  usernameTaken: boolean;
  submitError?: string | null;
  onSignUp: (form: SignUpForm) => Promise<void>;
  onLogin: (form: LoginForm) => Promise<void>;
  onSwitchPlayer: () => void;
  /** Local-only: which auth mode the sign-up/login switcher is showing. */
  mode: "signUp" | "login";
  onChangeMode: (mode: "signUp" | "login") => void;
};

export type AccountStepKey = "signUp" | "login" | "keyReveal" | "profile";

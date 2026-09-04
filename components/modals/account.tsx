import React, { useRef, useState } from "react";
import { createModal } from "./factory/createModal";
import { SignUpStep } from "./account/SignUpStep";
import { LoginStep } from "./account/LoginStep";
import { KeyRevealStep } from "./account/KeyRevealStep";
import { ProfileStep } from "./account/ProfileStep";
import { AccountModalProps, AccountStepKey } from "./account/types";
import { SignUpForm, LoginForm } from "@/hooks/use-registration";
import { User } from "@/types";

const AccountModalSteps = createModal<AccountModalProps, AccountStepKey>({
  steps: {
    signUp: SignUpStep,
    login: LoginStep,
    keyReveal: KeyRevealStep,
    profile: ProfileStep,
  },
  // Priority: a freshly generated key always wins (it must be shown once,
  // even though the local user is already set by then), then an existing
  // local player shows their profile, otherwise the sign-up/login switcher.
  resolveStep: (props) => {
    if (props.generatedKey) return "keyReveal";
    if (props.user) return "profile";
    return props.mode;
  },
  maxWidth: 480,
});

type AccountModalPublicProps = {
  visible: boolean;
  onClose: () => void;
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
};

function AccountModalInner({
  visible,
  onClose,
  ...rest
}: AccountModalPublicProps) {
  const [mode, setMode] = useState<"signUp" | "login">("signUp");

  return (
    <AccountModalSteps
      visible={visible}
      onRequestClose={onClose}
      mode={mode}
      onChangeMode={setMode}
      {...rest}
    />
  );
}

export default function AccountModal(props: AccountModalPublicProps) {
  // Bump the key only on the closed->open transition, so local `mode` state
  // resets fresh each time the modal opens (no effect needed) — but stays
  // mounted while closing, so ModalShell's exit animation can still play.
  const openCount = useRef(0);
  const wasVisible = useRef(props.visible);
  if (props.visible && !wasVisible.current) openCount.current += 1;
  wasVisible.current = props.visible;

  return <AccountModalInner key={openCount.current} {...props} />;
}

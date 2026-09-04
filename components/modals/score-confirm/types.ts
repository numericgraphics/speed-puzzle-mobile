export type ScoreConfirmModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  userName: string;
  score: number;
  submitting: boolean;
  submitted: boolean;
  submitError?: string | null;
};

export type ScoreConfirmStepKey = "confirm" | "submitted";

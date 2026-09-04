import React from "react";
import { createModal } from "./factory/createModal";
import { ConfirmStep } from "./score-confirm/ConfirmStep";
import { SubmittedStep } from "./score-confirm/SubmittedStep";
import { ScoreConfirmModalProps, ScoreConfirmStepKey } from "./score-confirm/types";

const ScoreConfirmModalSteps = createModal<ScoreConfirmModalProps, ScoreConfirmStepKey>({
  steps: {
    confirm: ConfirmStep,
    submitted: SubmittedStep,
  },
  resolveStep: (props) => (props.submitted ? "submitted" : "confirm"),
});

type ScoreConfirmModalPublicProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  score: number;
  submitting: boolean;
  submitted: boolean;
  submitError?: string | null;
};

export default function ScoreConfirmModal({
  onClose,
  ...rest
}: ScoreConfirmModalPublicProps) {
  return <ScoreConfirmModalSteps onRequestClose={onClose} {...rest} />;
}

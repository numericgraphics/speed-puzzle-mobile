import React, { ComponentType } from "react";
import { ModalShell } from "./ModalShell";
import { StepTransition } from "./StepTransition";

type BaseProps = {
  visible: boolean;
  onRequestClose: () => void;
};

/**
 * Build a multi-step modal component from a config: which step is active is
 * decided by `resolveStep(props)`, and each step renders via `steps[key]`.
 * Open/close and step-to-step transitions are handled once here (via
 * ModalShell / StepTransition) so every modal in the app animates the same
 * way and that behavior can be retuned from a single place.
 */
export function createModal<Props extends BaseProps, StepKey extends string>(config: {
  steps: Record<StepKey, ComponentType<Props>>;
  resolveStep: (props: Props) => StepKey;
  maxWidth?: number;
}) {
  const { steps, resolveStep, maxWidth } = config;

  function GeneratedModal(props: Props) {
    const stepKey = resolveStep(props);
    // Each step component declares its own subset of Props as required —
    // the factory always supplies the full Props, so this is sound, but
    // TS can't verify that generically across an indexed step map.
    const StepComponent = steps[stepKey] as ComponentType<Props>;

    return (
      <ModalShell
        visible={props.visible}
        onRequestClose={props.onRequestClose}
        maxWidth={maxWidth}
      >
        <StepTransition stepKey={stepKey}>
          <StepComponent {...props} />
        </StepTransition>
      </ModalShell>
    );
  }

  return GeneratedModal;
}

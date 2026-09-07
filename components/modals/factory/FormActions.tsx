import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Button, ButtonIconName } from "@/components/ui/Button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";

type FormActionsProps = {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  submittingLabel: string;
  submitting: boolean;
  submitIcon?: ButtonIconName;
  disabled?: boolean;
};

export function FormActions({
  onCancel,
  onSubmit,
  submitLabel,
  submittingLabel,
  submitting,
  submitIcon,
  disabled,
}: FormActionsProps) {
  const { theme } = useTheme();

  return (
    <ButtonGroup style={{ marginTop: theme.spacer[3].y }}>
      <Button label="Cancel" icon="cancel" onPress={onCancel} disabled={submitting} />
      <Button
        label={submitting ? submittingLabel : submitLabel}
        icon={submitIcon}
        onPress={onSubmit}
        disabled={disabled || submitting}
        loading={submitting}
      />
    </ButtonGroup>
  );
}

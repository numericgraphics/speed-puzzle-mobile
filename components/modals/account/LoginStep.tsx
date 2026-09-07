import React from "react";
import { Text } from "react-native";
import { useForm } from "react-hook-form";
import { useTheme } from "@/hooks/useTheme";
import { LinkText } from "@/components/ui/LinkText";
import { FormField } from "../factory/FormField";
import { FormActions } from "../factory/FormActions";
import { AccountModalProps } from "./types";

type FormValues = { userName: string; key: string };

export function LoginStep({
  onRequestClose,
  submitting,
  loginFailed,
  submitError,
  onLogin,
  onChangeMode,
}: AccountModalProps) {
  const { styles, theme } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { userName: "", key: "" },
  });

  const submit = handleSubmit(async (data) => {
    await onLogin({ userName: data.userName, key: data.key });
  });

  return (
    <>
      <Text style={[styles.typography.title, { marginBottom: theme.spacer[1].y }]}>
        Log In
      </Text>
      <Text style={[styles.typography.body, { marginBottom: theme.spacer[2].y }]}>
        Enter your username and recovery key to reconnect this device to your
        player.
      </Text>

      <FormField
        control={control}
        name="userName"
        placeholder="Username"
        autoCapitalize="none"
        textContentType="username"
        returnKeyType="next"
        error={errors.userName}
        rules={{ required: "Username is required" }}
      />

      <FormField
        control={control}
        name="key"
        placeholder="Recovery key"
        autoCapitalize="characters"
        returnKeyType="done"
        error={errors.key}
        rules={{ required: "Recovery key is required" }}
      />

      {loginFailed ? (
        <Text style={[styles.typography.label, { color: theme.color.error, marginBottom: theme.spacer[1].y }]}>
          Invalid username or key.
        </Text>
      ) : null}
      {submitError ? (
        <Text style={[styles.typography.label, { color: theme.color.error, marginBottom: theme.spacer[1].y }]}>
          {submitError}
        </Text>
      ) : null}

      <FormActions
        onCancel={onRequestClose}
        onSubmit={submit}
        submitLabel="Log in"
        submittingLabel="Checking..."
        submitIcon="login"
        submitting={submitting}
        disabled={!isValid}
      />

      <Text
        style={[
          styles.typography.label,
          { textAlign: "center", marginTop: theme.spacer[2].y },
        ]}
      >
        New here?{" "}
        <LinkText label="Sign up instead" onPress={() => onChangeMode("signUp")} />
      </Text>
    </>
  );
}

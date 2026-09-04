import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { useTheme } from "@/hooks/useTheme";
import { FormField } from "../factory/FormField";
import { FormActions } from "../factory/FormActions";
import { AccountModalProps } from "./types";

type FormValues = { userName: string };

const NO_SPACE = /^\S+$/;

export function SignUpStep({
  onRequestClose,
  submitting,
  usernameTaken,
  submitError,
  onSignUp,
  onChangeMode,
}: AccountModalProps) {
  const { styles, theme } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onChange", defaultValues: { userName: "" } });

  const submit = handleSubmit(async (data) => {
    await onSignUp({ userName: data.userName });
  });

  return (
    <>
      <Text style={[styles.typography.title, { marginBottom: 12 }]}>Sign Up</Text>

      <FormField
        control={control}
        name="userName"
        placeholder="Choose a username"
        autoCapitalize="none"
        textContentType="username"
        returnKeyType="done"
        error={errors.userName}
        rules={{
          required: "Name is required",
          minLength: { value: 4, message: "Min length is 4" },
          maxLength: { value: 9, message: "Max length is 9" },
          pattern: { value: NO_SPACE, message: "No spaces allowed" },
        }}
      />

      <Text style={[styles.typography.label, { marginBottom: 10, opacity: 0.7 }]}>
        We&apos;ll generate a recovery key for you after this — it&apos;s the
        only way to get back into this account, so make sure you can save it.
      </Text>

      {usernameTaken ? (
        <Text style={[styles.typography.label, { color: "red", marginBottom: 10 }]}>
          That username is already taken — try another one.
        </Text>
      ) : null}

      {submitError ? (
        <Text style={[styles.typography.label, { color: "red", marginBottom: 10 }]}>
          {submitError}
        </Text>
      ) : null}

      <FormActions
        onCancel={onRequestClose}
        onSubmit={submit}
        submitLabel="Sign up"
        submittingLabel="Creating..."
        submitting={submitting}
        disabled={!isValid}
      />

      <TouchableOpacity
        onPress={() => onChangeMode("login")}
        style={{ marginTop: theme.spacer[2].y }}
      >
        <Text style={[styles.typography.label, { textAlign: "center" }]}>
          Already have a username and key? Log in
        </Text>
      </TouchableOpacity>
    </>
  );
}

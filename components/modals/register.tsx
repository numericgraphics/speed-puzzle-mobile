import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useTheme } from "@/hooks/useTheme";

type FormValues = {
  userName: string;
  email: string;
};

type RegistrationModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: { userName: string; email?: string }) => Promise<void> | void;
  submitting: boolean;
  submitted: boolean;
  recognized: boolean;
  userName?: string;
  /**
   * Optionally pass an error string from your API to display under the button.
   */
  submitError?: string | null;
};

const NO_SPACE = /^\S+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistrationModal({
  visible,
  onClose,
  onSubmit,
  submitting,
  submitted,
  recognized,
  userName,
  submitError,
}: RegistrationModalProps) {
  const { styles, isDark } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { userName: "", email: "" },
  });

  const submit = handleSubmit(async (data) => {
    await onSubmit({
      userName: data.userName,
      email: data.email?.trim() || undefined,
    });
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.containers.centeredFullScreen,
          { padding: 24, backgroundColor: "rgba(0,0,0,0.6)" },
        ]}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 420,
            padding: 25,
            borderRadius: 25,
            borderColor: isDark ? "#fff" : "#000",
            borderWidth: 1,
            backgroundColor: styles.containers.main?.backgroundColor ?? "#fff",
          }}
        >
          {submitted ? (
            <>
              <Text style={[styles.typography.title, { marginBottom: 12 }]}>
                {recognized ? "Welcome Back 👋" : "You’re on the Board 🎉"}
              </Text>
              <Text style={[styles.typography.body, { marginBottom: 24 }]}>
                {recognized
                  ? `We recognized ${userName} from that email — this device is now linked to your player.`
                  : `${userName} is saved. Nice run!`}
              </Text>
              <View
                style={[styles.containers.row, { justifyContent: "flex-end" }]}
              >
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.buttons.linkButton}>Continue</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.typography.title, { marginBottom: 12 }]}>
                New Top Score 🎉
              </Text>
              <Text style={[styles.typography.body, { marginBottom: 16 }]}>
                You’re in the top 10 fastest times. Enter your name for the
                leaderboard:
              </Text>

              {/* Username */}
              <Text style={[styles.typography.labelBold, { marginBottom: 6 }]}>
                Name
              </Text>
              <Controller
                control={control}
                name="userName"
                rules={{
                  required: "Name is required",
                  minLength: { value: 4, message: "Min length is 4" },
                  maxLength: { value: 9, message: "Max length is 9" },
                  pattern: { value: NO_SPACE, message: "No spaces allowed" },
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <TextInput
                    ref={ref}
                    style={[styles.inputs.textInput, { marginBottom: 6 }]}
                    placeholder="Your name"
                    placeholderTextColor={"#999"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="username"
                    returnKeyType="next"
                  />
                )}
              />
              {errors.userName && (
                <Text
                  style={[
                    styles.typography.label,
                    { color: "red", marginBottom: 10 },
                  ]}
                >
                  {errors.userName.message}
                </Text>
              )}

              {/* Email (optional) */}
              <Text style={[styles.typography.labelBold, { marginBottom: 6 }]}>
                Email (optional)
              </Text>
              <Controller
                control={control}
                name="email"
                rules={{
                  pattern: {
                    value: EMAIL_PATTERN,
                    message: "Enter a valid email",
                  },
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <TextInput
                    ref={ref}
                    style={[styles.inputs.textInput, { marginBottom: 6 }]}
                    placeholder="you@example.com"
                    placeholderTextColor={"#999"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    returnKeyType="done"
                  />
                )}
              />
              <Text
                style={[
                  styles.typography.label,
                  { marginBottom: 6, opacity: 0.7 },
                ]}
              >
                Keeps your name and scores if you switch devices — for
                support use only, no login required.
              </Text>
              {errors.email && (
                <Text
                  style={[
                    styles.typography.label,
                    { color: "red", marginBottom: 10 },
                  ]}
                >
                  {errors.email.message}
                </Text>
              )}

              {submitError ? (
                <Text
                  style={[
                    styles.typography.label,
                    { color: "red", marginBottom: 10 },
                  ]}
                >
                  {submitError}
                </Text>
              ) : null}

              <View
                style={[
                  styles.containers.row,
                  {
                    justifyContent: "space-between",
                    marginTop: 50,
                  },
                ]}
              >
                <TouchableOpacity onPress={onClose} disabled={submitting}>
                  <Text style={styles.buttons.linkButton}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={submit}
                  disabled={!isValid || submitting}
                >
                  <Text style={styles.buttons.linkButton}>
                    {submitting ? "Saving..." : "Save Score"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

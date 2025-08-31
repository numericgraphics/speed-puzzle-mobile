import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useTheme } from "@/hooks/useTheme";
import { User } from "@/types";

type FormValues = {
  userName: string;
  password: string;
};

type RegistrationModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void> | void;
  /**
   * Optionally pass an error string from your API to display under the button.
   */
  submitError?: string | null;
};

const NO_SPACE = /^\S+$/;

export default function RegistrationModal({
  visible,
  onClose,
  onSubmit,
  submitError,
}: RegistrationModalProps) {
  const { styles, isDark } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { userName: "", password: "" },
  });

  const submit = handleSubmit(async (data) => {
    await onSubmit(data);
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
          <Text style={[styles.typography.title, { marginBottom: 12 }]}>
            New Top Score 🎉
          </Text>
          <Text style={[styles.typography.body, { marginBottom: 16 }]}>
            You’re in the top 10 fastest times. Save your score:
          </Text>

          {/* Username */}
          <Text style={[styles.typography.labelBold, { marginBottom: 6 }]}>
            Username
          </Text>
          <Controller
            control={control}
            name="userName"
            rules={{
              required: "Username is required",
              minLength: { value: 4, message: "Min length is 4" },
              maxLength: { value: 9, message: "Max length is 9" },
              pattern: { value: NO_SPACE, message: "No spaces allowed" },
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextInput
                ref={ref}
                style={[styles.inputs.textInput, { marginBottom: 6 }]}
                placeholder="Your username"
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

          {/* Password */}
          <Text style={[styles.typography.labelBold, { marginBottom: 6 }]}>
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: { value: 4, message: "Min length is 4" },
              maxLength: { value: 9, message: "Max length is 9" },
              pattern: { value: NO_SPACE, message: "No spaces allowed" },
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextInput
                ref={ref}
                style={[styles.inputs.textInput, { marginBottom: 6 }]}
                placeholder="Your password"
                placeholderTextColor={"#999"}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                secureTextEntry
                returnKeyType="done"
              />
            )}
          />
          {errors.password && (
            <Text
              style={[
                styles.typography.label,
                { color: "red", marginBottom: 10 },
              ]}
            >
              {errors.password.message}
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
                // backgroundColor: "yellow",
              },
            ]}
          >
            <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
              <Text style={styles.buttons.linkButton}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={submit}
              disabled={!isValid || isSubmitting}
            >
              <Text style={styles.buttons.linkButton}>
                {isSubmitting ? "Saving..." : "Save Score"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

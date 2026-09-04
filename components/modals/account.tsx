import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useTheme } from "@/hooks/useTheme";
import { SignUpForm, LoginForm } from "@/hooks/use-registration";
import { User } from "@/types";

type Mode = "signUp" | "login";

type AccountModalProps = {
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

type FormValues = { userName: string; key: string };

const NO_SPACE = /^\S+$/;

export default function AccountModal({
  visible,
  onClose,
  user,
  submitting,
  submitted,
  generatedKey,
  loginFailed,
  usernameTaken,
  submitError,
  onSignUp,
  onLogin,
  onSwitchPlayer,
}: AccountModalProps) {
  const { styles, isDark } = useTheme();
  const [mode, setMode] = useState<Mode>("signUp");
  const [keyAcknowledged, setKeyAcknowledged] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { userName: "", key: "" },
  });

  useEffect(() => {
    if (visible) {
      setMode("signUp");
      setKeyAcknowledged(false);
      reset({ userName: "", key: "" });
    }
  }, [visible, reset]);

  const close = () => {
    // Block closing while a freshly generated key hasn't been acknowledged —
    // it is shown exactly once and can't be recovered afterwards.
    if (generatedKey && !keyAcknowledged) return;
    onClose();
  };

  const submitSignUp = handleSubmit(async (data) => {
    await onSignUp({ userName: data.userName });
  });

  const submitLogin = handleSubmit(async (data) => {
    await onLogin({ userName: data.userName, key: data.key });
  });

  const renderKeyReveal = () => (
    <>
      <Text style={[styles.typography.title, { marginBottom: 12 }]}>
        You're on the Board 🎉
      </Text>
      <Text style={[styles.typography.body, { marginBottom: 16 }]}>
        Save this recovery key somewhere safe. It's the only way to sign back
        in as {user?.userName} on another device — we can't show it to you
        again.
      </Text>
      <View
        style={{
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isDark ? "#fff" : "#000",
          marginBottom: 16,
        }}
      >
        <Text
          style={[
            styles.typography.title,
            {
              fontSize: 28,
              letterSpacing: 2,
              textAlign: "center",
              fontFamily: "monospace",
            },
          ]}
          selectable
        >
          {generatedKey}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => setKeyAcknowledged(true)}
        style={{ marginBottom: keyAcknowledged ? 16 : 0 }}
      >
        <Text style={styles.buttons.linkButton}>
          {keyAcknowledged ? "✓ Key saved" : "I've saved my key"}
        </Text>
      </TouchableOpacity>
      {keyAcknowledged && (
        <View style={[styles.containers.row, { justifyContent: "flex-end" }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.buttons.linkButton}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  const renderProfile = () => (
    <>
      <Text style={[styles.typography.title, { marginBottom: 12 }]}>
        Player
      </Text>
      <Text style={[styles.typography.body, { marginBottom: 6 }]}>
        {user?.userName}
      </Text>
      <Text style={[styles.typography.label, { marginBottom: 24 }]}>
        {user?.bestScore != null
          ? `Best score on this device: ${user.bestScore}`
          : "No score registered yet on this device"}
      </Text>
      <View style={[styles.containers.row, { justifyContent: "space-between" }]}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.buttons.linkButton}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onSwitchPlayer();
            onClose();
          }}
        >
          <Text style={styles.buttons.linkButton}>Play as someone else</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderSignUpFields = () => (
    <>
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
            placeholder="Choose a username"
            placeholderTextColor={"#999"}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            returnKeyType="done"
          />
        )}
      />
      {errors.userName && (
        <Text
          style={[styles.typography.label, { color: "red", marginBottom: 10 }]}
        >
          {errors.userName.message}
        </Text>
      )}
      <Text style={[styles.typography.label, { marginBottom: 10, opacity: 0.7 }]}>
        We'll generate a recovery key for you after this — it's the only way
        to get back into this account, so make sure you can save it.
      </Text>

      {usernameTaken ? (
        <Text
          style={[styles.typography.label, { color: "red", marginBottom: 10 }]}
        >
          That username is already taken — try another one.
        </Text>
      ) : null}

      {submitError ? (
        <Text
          style={[styles.typography.label, { color: "red", marginBottom: 10 }]}
        >
          {submitError}
        </Text>
      ) : null}

      <View
        style={[
          styles.containers.row,
          { justifyContent: "space-between", marginTop: 30 },
        ]}
      >
        <TouchableOpacity onPress={onClose} disabled={submitting}>
          <Text style={styles.buttons.linkButton}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={submitSignUp} disabled={!isValid || submitting}>
          <Text style={styles.buttons.linkButton}>
            {submitting ? "Creating..." : "Sign up"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setMode("login")} style={{ marginTop: 16 }}>
        <Text style={[styles.typography.label, { textAlign: "center" }]}>
          Already have a username and key? Log in
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderLoginFields = () => (
    <>
      <Text style={[styles.typography.title, { marginBottom: 12 }]}>
        Log In
      </Text>
      <Text style={[styles.typography.body, { marginBottom: 16 }]}>
        Enter your username and recovery key to reconnect this device to your
        player.
      </Text>
      <Controller
        control={control}
        name="userName"
        rules={{ required: "Username is required" }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <TextInput
            ref={ref}
            style={[styles.inputs.textInput, { marginBottom: 6 }]}
            placeholder="Username"
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
          style={[styles.typography.label, { color: "red", marginBottom: 10 }]}
        >
          {errors.userName.message}
        </Text>
      )}

      <Controller
        control={control}
        name="key"
        rules={{ required: "Recovery key is required" }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <TextInput
            ref={ref}
            style={[styles.inputs.textInput, { marginBottom: 6 }]}
            placeholder="Recovery key"
            placeholderTextColor={"#999"}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="done"
          />
        )}
      />
      {errors.key && (
        <Text
          style={[styles.typography.label, { color: "red", marginBottom: 10 }]}
        >
          {errors.key.message}
        </Text>
      )}

      {loginFailed ? (
        <Text
          style={[styles.typography.label, { color: "red", marginBottom: 10 }]}
        >
          Invalid username or key.
        </Text>
      ) : null}
      {submitError ? (
        <Text
          style={[styles.typography.label, { color: "red", marginBottom: 10 }]}
        >
          {submitError}
        </Text>
      ) : null}

      <View
        style={[
          styles.containers.row,
          { justifyContent: "space-between", marginTop: 20 },
        ]}
      >
        <TouchableOpacity onPress={onClose} disabled={submitting}>
          <Text style={styles.buttons.linkButton}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={submitLogin} disabled={!isValid || submitting}>
          <Text style={styles.buttons.linkButton}>
            {submitting ? "Checking..." : "Log in"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setMode("signUp")} style={{ marginTop: 16 }}>
        <Text style={[styles.typography.label, { textAlign: "center" }]}>
          New here? Sign up instead
        </Text>
      </TouchableOpacity>
    </>
  );

  const content = generatedKey
    ? renderKeyReveal()
    : user
    ? renderProfile()
    : mode === "signUp"
    ? (
        <>
          <Text style={[styles.typography.title, { marginBottom: 12 }]}>
            Sign Up
          </Text>
          {renderSignUpFields()}
        </>
      )
    : renderLoginFields();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
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
          {content}
        </View>
      </View>
    </Modal>
  );
}

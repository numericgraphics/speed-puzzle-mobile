import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useTheme } from "@/hooks/useTheme";
import { UserPublic } from "@/lib/api";

type FormValues = { email: string };

type RecoverPlayerModalProps = {
  visible: boolean;
  onClose: () => void;
  onLookup: (email: string) => Promise<UserPublic | null>;
  onConfirm: (user: UserPublic) => Promise<void>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RecoverPlayerModal({
  visible,
  onClose,
  onLookup,
  onConfirm,
}: RecoverPlayerModalProps) {
  const { styles, isDark } = useTheme();
  const [searching, setSearching] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [found, setFound] = useState<UserPublic | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const reset_ = () => {
    setFound(null);
    setNotFound(false);
    setError(null);
    reset();
  };

  const close = () => {
    reset_();
    onClose();
  };

  const search = handleSubmit(async (data) => {
    setSearching(true);
    setError(null);
    setNotFound(false);
    try {
      const result = await onLookup(data.email.trim());
      if (result) {
        setFound(result);
      } else {
        setNotFound(true);
      }
    } catch (e: any) {
      setError(e?.message ?? "Could not look up that email");
    } finally {
      setSearching(false);
    }
  });

  const confirm = async () => {
    if (!found) return;
    setConfirming(true);
    try {
      await onConfirm(found);
      reset_();
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Could not recover this player");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
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
            Recover Player
          </Text>

          {found ? (
            <>
              <Text style={[styles.typography.body, { marginBottom: 6 }]}>
                Found: {found.userName}
              </Text>
              <Text style={[styles.typography.label, { marginBottom: 24 }]}>
                {found.bestScore != null
                  ? `Best score: ${found.bestScore}`
                  : "No score registered yet"}
              </Text>

              {error ? (
                <Text
                  style={[
                    styles.typography.label,
                    { color: "red", marginBottom: 10 },
                  ]}
                >
                  {error}
                </Text>
              ) : null}

              <View
                style={[
                  styles.containers.row,
                  { justifyContent: "space-between" },
                ]}
              >
                <TouchableOpacity onPress={close} disabled={confirming}>
                  <Text style={styles.buttons.linkButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirm} disabled={confirming}>
                  <Text style={styles.buttons.linkButton}>
                    {confirming ? "Loading..." : "That's me"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.typography.body, { marginBottom: 16 }]}>
                Already have a player? Enter the email you registered with.
              </Text>

              <Controller
                control={control}
                name="email"
                rules={{
                  required: "Email is required",
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

              {notFound ? (
                <Text
                  style={[
                    styles.typography.label,
                    { color: "red", marginBottom: 10 },
                  ]}
                >
                  No player found with that email. Check the address, or
                  start fresh by playing a game.
                </Text>
              ) : null}
              {error ? (
                <Text
                  style={[
                    styles.typography.label,
                    { color: "red", marginBottom: 10 },
                  ]}
                >
                  {error}
                </Text>
              ) : null}

              <View
                style={[
                  styles.containers.row,
                  { justifyContent: "space-between", marginTop: 20 },
                ]}
              >
                <TouchableOpacity onPress={close} disabled={searching}>
                  <Text style={styles.buttons.linkButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={search}
                  disabled={!isValid || searching}
                >
                  <Text style={styles.buttons.linkButton}>
                    {searching ? "Searching..." : "Find my player"}
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

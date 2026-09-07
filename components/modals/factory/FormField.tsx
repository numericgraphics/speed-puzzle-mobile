import React from "react";
import { Text, TextInput, TextInputProps } from "react-native";
import { Control, Controller, FieldError } from "react-hook-form";
import { useTheme } from "@/hooks/useTheme";

type FormFieldProps = {
  control: Control<any>;
  name: string;
  rules?: object;
  error?: FieldError;
} & Pick<
  TextInputProps,
  | "placeholder"
  | "autoCapitalize"
  | "textContentType"
  | "returnKeyType"
  | "keyboardType"
>;

export function FormField({
  control,
  name,
  rules,
  error,
  ...inputProps
}: FormFieldProps) {
  const { theme, styles } = useTheme();

  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <TextInput
            ref={ref}
            style={[
              styles.inputs.textInput,
              { marginBottom: theme.spacer[1].y },
            ]}
            placeholderTextColor={theme.color.inactive}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCorrect={false}
            {...inputProps}
          />
        )}
      />
      {error && (
        <Text
          style={[
            styles.typography.label,
            { color: theme.color.error, marginBottom: theme.spacer[1].y },
          ]}
        >
          {error.message}
        </Text>
      )}
    </>
  );
}

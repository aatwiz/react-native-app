import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import { submitOtp } from "../api/authApi";
import AipLogo from "../components/AipLogo";

const CODE_LENGTH = 6;

interface OtpScreenProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
}

export default function OtpScreen({ email, onNext, onBack }: OtpScreenProps) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const insets = useSafeAreaInsets();

  const handleChange = (text: string, index: number) => {
    // Only accept digits
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (error) setError("");

    // Auto-advance to next input
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when last digit entered
    if (digit && index === CODE_LENGTH - 1) {
      const code = next.join("");
      if (code.length === CODE_LENGTH) {
        handleSubmit(code);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
    }
  };

  const handleSubmit = async (code?: string) => {
    const finalCode = code ?? digits.join("");
    if (finalCode.length !== CODE_LENGTH) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await submitOtp(email, finalCode);
      if (result.success) {
        onNext();
      } else {
        setError(result.message ?? "Invalid code. Please try again.");
        setDigits(Array(CODE_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top + 60 }]}>
        {/* AIP Logo */}
        <View style={styles.logoWrapper}>
          <AipLogo width={80} height={65} />
        </View>

        <Text style={styles.title}>Two Factor Authentication</Text>
        <Text style={styles.subtitle}>
          For your security, enter the six-digit code from your authentication
          app to login into AIP
        </Text>

        {/* OTP input boxes — 3 digits, dash, 3 digits */}
        <View style={styles.codeRow}>
          {digits.slice(0, 3).map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => {
                inputRefs.current[i] = ref;
              }}
              style={[
                styles.codeBox,
                digit ? styles.codeBoxFilled : null,
                error ? styles.codeBoxError : null,
              ]}
              value={digit}
              onChangeText={(t) => handleChange(t, i)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, i)
              }
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!loading}
            />
          ))}
          <Text style={styles.dashSeparator}>-</Text>
          {digits.slice(3).map((digit, i) => (
            <TextInput
              key={i + 3}
              ref={(ref) => {
                inputRefs.current[i + 3] = ref;
              }}
              style={[
                styles.codeBox,
                digit ? styles.codeBoxFilled : null,
                error ? styles.codeBoxError : null,
              ]}
              value={digit}
              onChangeText={(t) => handleChange(t, i + 3)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, i + 3)
              }
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!loading}
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Verify button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => handleSubmit()}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textOnPrimary} size="small" />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xxl,
    alignItems: "center",
  },
  logoWrapper: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xxl,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
    paddingHorizontal: spacing.md,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  codeBox: {
    width: 46,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    backgroundColor: colors.inputBackground,
    textAlign: "center",
    fontSize: typography.fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  codeBoxFilled: {
    borderColor: colors.primary,
  },
  codeBoxError: {
    borderColor: colors.error,
  },
  dashSeparator: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "700",
    color: colors.textSecondary,
    marginHorizontal: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: "600",
  },
});

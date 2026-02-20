import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import AipLogo from "../components/AipLogo";

const CODE_LENGTH = 6;

/** A placeholder QR code rendered with a bordered box + text. */
function QrCodePlaceholder() {
  return (
    <View style={qrStyles.container}>
      <View style={qrStyles.grid}>
        {/* Simulated QR pattern — 7x7 grid of blocks */}
        {Array.from({ length: 49 }).map((_, i) => (
          <View
            key={i}
            style={[
              qrStyles.block,
              {
                backgroundColor:
                  // Pseudo-random pattern for visual effect
                  (i % 3 === 0 || i % 7 === 0 || i % 5 === 2)
                    ? colors.textPrimary
                    : colors.surface,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const qrStyles = StyleSheet.create({
  container: {
    width: 160,
    height: 160,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  grid: {
    width: 140,
    height: 140,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  block: {
    width: 20,
    height: 20,
  },
});

interface AuthenticatorSetupScreenProps {
  onNext: () => void;
}

export default function AuthenticatorSetupScreen({
  onNext,
}: AuthenticatorSetupScreenProps) {
  const insets = useSafeAreaInsets();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (error) setError("");

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (digit && index === CODE_LENGTH - 1) {
      const code = next.join("");
      if (code.length === CODE_LENGTH) {
        handleVerify(code);
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

  const handleVerify = async (code?: string) => {
    const finalCode = code ?? digits.join("");
    if (finalCode.length !== CODE_LENGTH) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");
    // Simulate verification
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onNext();
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
    >
      {/* AIP Logo */}
      <View style={styles.logoWrapper}>
        <AipLogo width={80} height={65} />
      </View>

      <Text style={styles.title}>Mobile Authenticator Setup</Text>

      {/* Step 1 */}
      <Text style={styles.stepHeader}>STEP 1</Text>
      <Text style={styles.stepText}>
        Install and open one of these applications on your mobile:
      </Text>
      <View style={styles.bulletList}>
        <Text style={styles.bulletItem}>• Microsoft Authenticator</Text>
        <Text style={styles.bulletItem}>• Google Authenticator</Text>
        <Text style={styles.bulletItem}>• FreeOTP</Text>
      </View>

      {/* Step 2 */}
      <Text style={styles.stepHeader}>STEP 2</Text>
      <Text style={styles.stepText}>Scan this QR code using the app</Text>

      <QrCodePlaceholder />

      <Text style={styles.qrFallbackLabel}>
        Can't scan this QR? Enter the code manually in the app
      </Text>
      <View style={styles.manualCodeBox}>
        <Text style={styles.manualCodeText} selectable>
          MNBW 6ZCG GRJF MM2F KI4W GNBT GJKU I6LR
        </Text>
      </View>

      {/* Step 3 */}
      <Text style={styles.stepHeader}>STEP 3</Text>
      <Text style={styles.stepText}>
        Enter the 6-digit code from your authentication app.
      </Text>

      {/* OTP input — 3 digits, dash, 3 digits */}
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
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
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
        onPress={() => handleVerify()}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.textOnPrimary} size="small" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
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
    marginBottom: spacing.xxl,
    textAlign: "center",
  },
  stepHeader: {
    alignSelf: "flex-start",
    fontSize: typography.fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  stepText: {
    alignSelf: "flex-start",
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
  bulletList: {
    alignSelf: "flex-start",
    marginBottom: spacing.lg,
    paddingLeft: spacing.lg,
  },
  bulletItem: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
  qrFallbackLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  manualCodeBox: {
    width: "100%",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xxl,
    flexDirection: "row",
    alignItems: "center",
  },
  manualCodeText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: "500",
    letterSpacing: 0.5,
    flex: 1,
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

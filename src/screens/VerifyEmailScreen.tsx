import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import AipLogo from "../components/AipLogo";
import { useAuth } from "../context/AuthContext";

interface VerifyEmailScreenProps {
  email: string;
}

export default function VerifyEmailScreen({ email }: VerifyEmailScreenProps) {
  const insets = useSafeAreaInsets();
  const { mockLogin } = useAuth();
  const [sending, setSending] = React.useState(false);

  const handleSendAgain = async () => {
    setSending(true);
    // Simulate sending verification email, then mock-login for dev
    await new Promise((r) => setTimeout(r, 1500));
    await mockLogin(email);
    setSending(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 60 }]}>
      {/* AIP Logo */}
      <View style={styles.logoWrapper}>
        <AipLogo width={80} height={65} />
      </View>

      <Text style={styles.title}>Verify Your Email to Get Started</Text>

      <Text style={styles.body}>
        Thank you for signing up! Please check your email inbox for a
        confirmation message. Click the link in the email to verify your account
        and get started with AÏP.
      </Text>

      <Text style={styles.body}>
        If you don't see the email, check your spam or junk folder, or request a
        new link.
      </Text>

      {/* Send Again button */}
      <TouchableOpacity
        style={[styles.button, sending && styles.buttonDisabled]}
        onPress={handleSendAgain}
        activeOpacity={0.8}
        disabled={sending}
      >
        {sending ? (
          <ActivityIndicator color={colors.textOnPrimary} size="small" />
        ) : (
          <Text style={styles.buttonText}>Send Again</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  body: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
    paddingHorizontal: spacing.sm,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
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

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

interface MagicLinkScreenProps {
  email: string;
  onBack: () => void;
}

export default function MagicLinkScreen({
  email,
  onBack,
}: MagicLinkScreenProps) {
  const insets = useSafeAreaInsets();
  const { mockLogin } = useAuth();
  const [resending, setResending] = React.useState(false);

  const handleResend = async () => {
    setResending(true);
    // Simulate magic link confirmation — logs in after short delay
    await new Promise((r) => setTimeout(r, 1500));
    await mockLogin(email);
    setResending(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 60 }]}>
      {/* AIP Logo */}
      <View style={styles.logoWrapper}>
        <AipLogo width={80} height={65} />
      </View>

      <Text style={styles.title}>Magic Link Sent</Text>
      <Text style={styles.subtitle}>
        We have sent an email to your mail with the secure magic link.
      </Text>

      {/* Send Again button */}
      <TouchableOpacity
        style={[styles.button, resending && styles.buttonDisabled]}
        onPress={handleResend}
        activeOpacity={0.8}
        disabled={resending}
      >
        {resending ? (
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
    marginBottom: spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xxl,
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

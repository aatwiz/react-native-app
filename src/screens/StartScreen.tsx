import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import AipLogo from "../components/AipLogo";

interface StartScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export default function StartScreen({ onLogin, onSignUp }: StartScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 80 }]}>
      {/* AIP Logo */}
      <View style={styles.logoWrapper}>
        <AipLogo width={100} height={82} />
      </View>

      <Text style={styles.title}>Welcome to AIP</Text>
      <Text style={styles.subtitle}>
        Your intelligent IP management assistant.{"\n"}Log in or create an
        account to get started.
      </Text>

      {/* Log In button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Log In</Text>
      </TouchableOpacity>

      {/* Sign Up button */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onSignUp}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryButtonText}>Sign Up</Text>
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
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.fontSize.heading,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xxxl + 8,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
    paddingHorizontal: spacing.md,
  },
  primaryButton: {
    width: "100%",
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    ...shadows.md,
  },
  primaryButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "100%",
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: "600",
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../theme";

/** Shown when a new chat is opened and no messages exist yet. */
export default function EmptyChat() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>AiP</Text>
      </View>
      <Text style={styles.title}>Ask AIP</Text>
      <Text style={styles.subtitle}>
        Your AI-powered IP consulting assistant.{"\n"}
        Ask me anything about intellectual property.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xxxl,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  logoText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: "700",
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
  },
});

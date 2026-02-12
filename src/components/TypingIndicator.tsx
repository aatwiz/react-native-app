import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing, typography, borderRadius } from "../theme";

/** Three-dot typing indicator shown when the bot is generating a reply. */
export default function TypingIndicator() {
  return (
    <View style={styles.row}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>AiP</Text>
      </View>
      <View style={styles.bubble}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.text}>AIP is thinking…</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  avatarText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.xs,
    fontWeight: "700",
  },
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.botBubble,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    fontStyle: "italic",
  },
});

import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { colors, spacing, borderRadius, typography } from "../theme";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Ask AIP a Question"
            placeholderTextColor={colors.placeholder}
            multiline
            maxLength={4000}
            editable={!disabled}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!text.trim() || disabled) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!text.trim() || disabled}
            activeOpacity={0.7}
          >
            <SendIcon />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/** Simple arrow-up send icon built with text. */
function SendIcon() {
  return (
    <View style={styles.iconContainer}>
      <View style={styles.arrow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingVertical: Platform.OS === "ios" ? spacing.md : spacing.sm,
    minHeight: 48,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    paddingVertical: 0,
    lineHeight: typography.fontSize.md * typography.lineHeight.normal,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.inputBorder,
  },
  iconContainer: {
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#FFFFFF",
  },
});

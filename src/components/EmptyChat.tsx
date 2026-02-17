import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../theme";
import AipLogo from "./AipLogo";

const GREETING = "How may I help?";

/** Shown when a new chat is opened and no messages exist yet. */
export default function EmptyChat() {
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [doneTyping, setDoneTyping] = useState(false);
  const indexRef = useRef(0);

  // Typewriter effect
  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText("");
    setDoneTyping(false);

    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current > GREETING.length) {
        clearInterval(interval);
        setDoneTyping(true);
        return;
      }
      setDisplayedText(GREETING.slice(0, indexRef.current));
    }, 70);

    return () => clearInterval(interval);
  }, []);

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <AipLogo width={72} height={59} />
      </View>
      <Text style={styles.title}>
        {displayedText}
        <Text style={[styles.cursor, !cursorVisible && styles.cursorHidden]}>|</Text>
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
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  cursor: {
    color: colors.primary,
    fontWeight: "300",
  },
  cursorHidden: {
    opacity: 0,
  },
});

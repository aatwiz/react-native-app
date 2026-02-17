import React, { useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors, spacing } from "../theme";
import { useChat } from "../context/ChatContext";
import { Message } from "../types";
import { ChatBubble, ChatInput, TypingIndicator, EmptyChat } from "../components";

export default function ChatScreen() {
  const { activeChat, sendMessage, isBotTyping, createNewChat } = useChat();
  const flatListRef = useRef<FlatList>(null);

  const messages = activeChat?.messages ?? [];

  const handleSend = useCallback(
    async (text: string) => {
      // If no active chat, create one first
      if (!activeChat) {
        await createNewChat();
      }
      await sendMessage(text);
    },
    [activeChat, sendMessage, createNewChat]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Message>) => (
      <ChatBubble message={item} />
    ),
    []
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {messages.length === 0 && !isBotTyping ? (
        <EmptyChat />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={isBotTyping ? <TypingIndicator /> : null}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />
      )}
      <ChatInput onSend={handleSend} disabled={isBotTyping} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
});

import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing, borderRadius } from "../theme";
import { useChat } from "../context/ChatContext";
import { Chat } from "../types";
import { truncate, formatDate } from "../utils";

export default function ChatDrawerContent(props: DrawerContentComponentProps) {
  const { chats, activeChat, setActiveChat, createNewChat, deleteChat } =
    useChat();
  const insets = useSafeAreaInsets();

  const handleNewChat = async () => {
    await createNewChat();
    props.navigation.closeDrawer();
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    props.navigation.closeDrawer();
  };

  const renderItem = ({ item }: ListRenderItemInfo<Chat>) => {
    const isActive = activeChat?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.chatItem, isActive && styles.chatItemActive]}
        onPress={() => handleSelectChat(item.id)}
        onLongPress={() => deleteChat(item.id)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.chatTitle, isActive && styles.chatTitleActive]}
          numberOfLines={1}
        >
          {truncate(item.title, 32)}
        </Text>
        <Text style={styles.chatDate}>{formatDate(item.updatedAt)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>AiP</Text>
          </View>
          <Text style={styles.brandName}>AIP Genius</Text>
        </View>
      </View>

      {/* New chat button */}
      <TouchableOpacity
        style={styles.newChatButton}
        onPress={handleNewChat}
        activeOpacity={0.8}
      >
        <Text style={styles.newChatIcon}>+</Text>
        <Text style={styles.newChatLabel}>New Chat</Text>
      </TouchableOpacity>

      {/* Chat history list */}
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No conversations yet</Text>
        }
      />

      {/* Footer hint */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Text style={styles.footerText}>Long press to delete a chat</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sidebar,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.sidebarHover,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: "700",
  },
  brandName: {
    color: colors.sidebarText,
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.sidebarHover,
    gap: spacing.sm,
  },
  newChatIcon: {
    color: colors.sidebarText,
    fontSize: typography.fontSize.xl,
    fontWeight: "300",
  },
  newChatLabel: {
    color: colors.sidebarText,
    fontSize: typography.fontSize.md,
    fontWeight: "500",
  },
  list: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  chatItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: 2,
  },
  chatItemActive: {
    backgroundColor: colors.sidebarActive,
  },
  chatTitle: {
    color: colors.sidebarText,
    fontSize: typography.fontSize.sm,
    fontWeight: "500",
  },
  chatTitleActive: {
    fontWeight: "700",
  },
  chatDate: {
    color: colors.sidebarTextMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  emptyText: {
    color: colors.sidebarTextMuted,
    fontSize: typography.fontSize.sm,
    textAlign: "center",
    marginTop: spacing.xxl,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.sidebarHover,
  },
  footerText: {
    color: colors.sidebarTextMuted,
    fontSize: typography.fontSize.xs,
    textAlign: "center",
  },
});

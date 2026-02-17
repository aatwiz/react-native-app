import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Switch,
  SectionListRenderItemInfo,
} from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing, borderRadius } from "../theme";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { Chat } from "../types";
import { truncate, formatDate, getDateGroupLabel } from "../utils";
import AipLogo from "../components/AipLogo";

interface ChatSection {
  title: string;
  data: Chat[];
}

export default function ChatDrawerContent(props: DrawerContentComponentProps) {
  const { chats, activeChat, setActiveChat, createNewChat, deleteChat } =
    useChat();
  const { userInfo, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const [menuVisible, setMenuVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  /* ── Sorted, filtered, grouped chats ── */
  const sections: ChatSection[] = useMemo(() => {
    // Sort by updatedAt descending
    let sorted = [...chats].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      sorted = sorted.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.messages.some((m) => m.content.toLowerCase().includes(q))
      );
    }

    // Group by date label
    const groupMap = new Map<string, Chat[]>();
    for (const chat of sorted) {
      const label = getDateGroupLabel(chat.updatedAt);
      if (!groupMap.has(label)) groupMap.set(label, []);
      groupMap.get(label)!.push(chat);
    }

    return Array.from(groupMap.entries()).map(([title, data]) => ({
      title,
      data,
    }));
  }, [chats, searchQuery]);

  const handleNewChat = async () => {
    await createNewChat();
    props.navigation.closeDrawer();
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    props.navigation.closeDrawer();
  };

  const renderItem = ({ item }: SectionListRenderItemInfo<Chat, ChatSection>) => {
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

  const renderSectionHeader = ({ section }: { section: ChatSection }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      {/* Header – brand row */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <AipLogo width={32} height={26} />
          <Text style={styles.brandName}>AIP Genius</Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search chats…"
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
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

      {/* Chat history – date-grouped section list */}
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No conversations yet</Text>
        }
      />

      {/* ── Filter modal ── */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable
          style={styles.filterOverlay}
          onPress={() => setFilterVisible(false)}
        >
          <View
            style={styles.filterSheet}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.filterTitle}>Filters</Text>

            {/* Messages toggle */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Messages</Text>
              <View style={styles.filterToggle}>
                <Text style={styles.filterToggleLabel}>
                  {showUnreadOnly ? "Unread" : "All"}
                </Text>
                <Switch
                  value={showUnreadOnly}
                  onValueChange={setShowUnreadOnly}
                  trackColor={{ false: colors.inputBorder, true: colors.primary }}
                  thumbColor="#FFF"
                />
              </View>
            </View>

            {/* Date section (placeholder for future pickers) */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Date</Text>
              <View style={styles.dateRow}>
                <View style={styles.dateInput}>
                  <Text style={styles.dateInputText}>From</Text>
                </View>
                <View style={styles.dateInput}>
                  <Text style={styles.dateInputText}>To</Text>
                </View>
              </View>
            </View>

            {/* IP Holders (placeholder) */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>IP Holders</Text>
              <View style={styles.pickerPlaceholder}>
                <Text style={styles.pickerText}>All Holders ▾</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.filterApplyButton}
              onPress={() => setFilterVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.filterApplyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* ── User profile footer ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {/* Popup menu */}
        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable
            style={styles.menuOverlay}
            onPress={() => setMenuVisible(false)}
          >
            <View style={[styles.menuContainer, { bottom: insets.bottom + 80 }]}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  logout();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        {/* Profile row */}
        <TouchableOpacity
          style={styles.profileRow}
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(userInfo?.name ?? userInfo?.preferred_username ?? "U")
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
              {userInfo?.name ?? userInfo?.preferred_username ?? "User"}
            </Text>
            <Text style={styles.profileEmail} numberOfLines={1}>
              {userInfo?.email ?? ""}
            </Text>
          </View>
          <Text style={styles.chevron}>⌃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sidebar,
  },
  /* ── Header ── */
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  brandName: {
    color: colors.sidebarText,
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
  },
  /* ── Search & filter bar ── */
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 36,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    paddingVertical: 0,
  },
  clearIcon: {
    color: colors.sidebarTextMuted,
    fontSize: 14,
    paddingLeft: spacing.xs,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.sidebarActive,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    color: colors.sidebarText,
    fontSize: 16,
  },
  /* ── New chat button ── */
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    gap: spacing.sm,
  },
  newChatIcon: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: "300",
  },
  newChatLabel: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: "600",
  },
  /* ── Section list ── */
  list: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
  },
  sectionHeader: {
    color: colors.sidebarTextMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
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
  /* ── Filter modal ── */
  filterOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  filterSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  filterTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  filterRow: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterToggleLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },
  dateRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  dateInput: {
    flex: 1,
    height: 40,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  dateInputText: {
    color: colors.placeholder,
    fontSize: typography.fontSize.sm,
  },
  pickerPlaceholder: {
    height: 40,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  pickerText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
  },
  filterApplyButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  filterApplyText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: "600",
  },
  /* ── Footer ── */
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.sidebarHover,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
  },
  profileName: {
    color: colors.sidebarText,
    fontSize: typography.fontSize.sm,
    fontWeight: "600",
  },
  profileEmail: {
    color: colors.sidebarTextMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 1,
  },
  chevron: {
    color: colors.sidebarTextMuted,
    fontSize: typography.fontSize.sm,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    position: "absolute",
    left: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xs,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  menuItemText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: "500",
  },
});

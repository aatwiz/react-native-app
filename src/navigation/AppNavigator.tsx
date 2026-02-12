import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatScreen from "../screens/ChatScreen";
import ChatDrawerContent from "./ChatDrawerContent";
import { useChat } from "../context/ChatContext";
import { colors, typography, spacing, borderRadius } from "../theme";

const Drawer = createDrawerNavigator();

function ChatHeader({
  navigation,
}: {
  navigation: any;
}) {
  const { activeChat, createNewChat } = useChat();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      {/* Hamburger / drawer toggle */}
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.toggleDrawer()}
        activeOpacity={0.7}
      >
        <View style={styles.hamburger}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </View>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.headerTitle} numberOfLines={1}>
        {activeChat ? activeChat.title : "Ask AIP"}
      </Text>

      {/* New chat button */}
      <TouchableOpacity
        style={styles.headerButton}
        onPress={createNewChat}
        activeOpacity={0.7}
      >
        <Text style={styles.newChatIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <ChatDrawerContent {...props} />}
      screenOptions={{
        header: ({ navigation }) => (
          <ChatHeader navigation={navigation} />
        ),
        drawerType: "front",
        drawerStyle: {
          width: "80%",
          maxWidth: 320,
        },
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}
    >
      <Drawer.Screen name="Chat" component={ChatScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.md,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginHorizontal: spacing.sm,
  },
  hamburger: {
    width: 20,
    height: 16,
    justifyContent: "space-between",
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.textPrimary,
    borderRadius: 1,
  },
  newChatIcon: {
    fontSize: typography.fontSize.xxl,
    color: colors.primary,
    fontWeight: "300",
  },
});

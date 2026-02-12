import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { userInfo, logout, accessToken } = useAuth();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.scroll}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {userInfo?.preferred_username ?? userInfo?.name ?? "User"} 👋
        </Text>
        <Text style={styles.sub}>You are authenticated via Keycloak.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>User Info</Text>
        <InfoRow label="Subject" value={userInfo?.sub} />
        <InfoRow label="Username" value={userInfo?.preferred_username} />
        <InfoRow label="Email" value={userInfo?.email} />
        <InfoRow label="Name" value={userInfo?.name} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Access Token (truncated)</Text>
        <Text style={styles.token} numberOfLines={4}>
          {accessToken}
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f0f4f8" },
  container: {
    padding: 24,
    paddingTop: 64,
  },
  header: { marginBottom: 24 },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  sub: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e9ecef",
  },
  label: { fontSize: 14, color: "#6c757d" },
  value: { fontSize: 14, color: "#1a1a2e", fontWeight: "500", flexShrink: 1 },
  token: {
    fontSize: 12,
    color: "#6c757d",
    fontFamily: "monospace",
  },
  logoutButton: {
    marginTop: 8,
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import AipLogo from "../components/AipLogo";

const USER_TYPES = ["IP Firm", "IP Holder"] as const;

interface SignUpScreenProps {
  onNext: (data: {
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
    company: string;
  }) => void;
  onLogin: () => void;
}

export default function SignUpScreen({ onNext, onLogin }: SignUpScreenProps) {
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<string>(USER_TYPES[0]);
  const [showPicker, setShowPicker] = useState(false);
  const [company, setCompany] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError("");
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!company.trim()) {
      setError("Company is required.");
      return;
    }
    if (!agreed) {
      setError("You must accept the User Agreement.");
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    onNext({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      userType,
      company: company.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* AIP Logo */}
        <View style={styles.logoWrapper}>
          <AipLogo width={80} height={65} />
        </View>

        <Text style={styles.title}>Sign Up to AÏP</Text>
        <Text style={styles.subtitle}>
          Sign up today and unlock access to AÏP completely free during your
          trial period. Explore powerful features designed to simplify and
          enhance your IP management.
        </Text>

        {/* Personal Information */}
        <Text style={styles.sectionLabel}>Personal Information</Text>

        <View style={styles.nameRow}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name*"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!loading}
          />
          <TextInput
            style={[styles.input, styles.nameInput]}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name*"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="E-Mail*"
          placeholderTextColor={colors.placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          editable={!loading}
        />

        {/* User Type */}
        <Text style={styles.sectionLabel}>User Type</Text>

        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowPicker(!showPicker)}
          activeOpacity={0.7}
        >
          <Text style={styles.pickerText}>{userType}</Text>
          <Text style={styles.pickerChevron}>{showPicker ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {showPicker && (
          <View style={styles.pickerDropdown}>
            {USER_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.pickerOption,
                  userType === type && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setUserType(type);
                  setShowPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    userType === type && styles.pickerOptionTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TextInput
          style={[styles.input, { marginTop: spacing.md }]}
          value={company}
          onChangeText={setCompany}
          placeholder="Company*"
          placeholderTextColor={colors.placeholder}
          autoCapitalize="words"
          autoCorrect={false}
          editable={!loading}
        />

        {/* User agreement checkbox */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I have read & accept the{" "}
            <Text style={styles.linkText}>User Agreement</Text>
          </Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Sign Up button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textOnPrimary} size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <TouchableOpacity onPress={onLogin}>
            <Text style={styles.loginLink}>Log in now!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    alignItems: "center",
  },
  logoWrapper: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xxl,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
    paddingHorizontal: spacing.xs,
  },
  sectionLabel: {
    alignSelf: "flex-start",
    fontSize: typography.fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  nameRow: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
    marginBottom: spacing.md,
  },
  nameInput: {
    flex: 1,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    backgroundColor: colors.inputBackground,
    marginBottom: spacing.md,
  },
  pickerButton: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.inputBackground,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerText: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },
  pickerChevron: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  pickerDropdown: {
    width: "100%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    overflow: "hidden",
    ...shadows.md,
  },
  pickerOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  pickerOptionSelected: {
    backgroundColor: colors.primary + "15",
  },
  pickerOptionText: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },
  pickerOptionTextSelected: {
    color: colors.primary,
    fontWeight: "600",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
    backgroundColor: colors.inputBackground,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.textOnPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  checkboxLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  linkText: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    marginTop: spacing.lg,
    alignItems: "center",
  },
  loginPrompt: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

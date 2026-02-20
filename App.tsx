import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { ChatProvider } from "./src/context/ChatContext";
import { AppNavigator } from "./src/navigation";
import StartScreen from "./src/screens/StartScreen";
import EmailScreen from "./src/screens/EmailScreen";
import OtpScreen from "./src/screens/OtpScreen";
import MagicLinkScreen from "./src/screens/MagicLinkScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import AuthenticatorSetupScreen from "./src/screens/AuthenticatorSetupScreen";
import VerifyEmailScreen from "./src/screens/VerifyEmailScreen";

type AuthStep =
  | "start"
  | "login-email"
  | "login-otp"
  | "login-magic-link"
  | "signup"
  | "signup-authenticator"
  | "signup-verify-email";

function Root() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authStep, setAuthStep] = useState<AuthStep>("start");
  const [email, setEmail] = useState("");
  const wasAuthenticated = useRef(isAuthenticated);

  // Reset to start screen on logout
  useEffect(() => {
    if (wasAuthenticated.current && !isAuthenticated) {
      setAuthStep("start");
      setEmail("");
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  if (isLoading) return null;

  if (isAuthenticated) return <AppNavigator />;

  switch (authStep) {
    case "start":
      return (
        <StartScreen
          onLogin={() => setAuthStep("login-email")}
          onSignUp={() => setAuthStep("signup")}
        />
      );

    /* ---- Login flow ---- */
    case "login-email":
      return (
        <EmailScreen
          onNext={(e) => {
            setEmail(e);
            setAuthStep("login-otp");
          }}
        />
      );
    case "login-otp":
      return (
        <OtpScreen
          email={email}
          onNext={() => setAuthStep("login-magic-link")}
          onBack={() => setAuthStep("login-email")}
        />
      );
    case "login-magic-link":
      return (
        <MagicLinkScreen
          email={email}
          onBack={() => setAuthStep("login-otp")}
        />
      );

    /* ---- Sign-up flow ---- */
    case "signup":
      return (
        <SignUpScreen
          onNext={(data) => {
            setEmail(data.email);
            setAuthStep("signup-authenticator");
          }}
          onLogin={() => setAuthStep("login-email")}
        />
      );
    case "signup-authenticator":
      return (
        <AuthenticatorSetupScreen
          onNext={() => setAuthStep("signup-verify-email")}
        />
      );
    case "signup-verify-email":
      return <VerifyEmailScreen email={email} />;
  }
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <ChatProvider>
              <StatusBar style="auto" />
              <Root />
            </ChatProvider>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

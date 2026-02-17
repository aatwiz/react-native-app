import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { ChatProvider } from "./src/context/ChatContext";
import { AppNavigator } from "./src/navigation";
import EmailScreen from "./src/screens/EmailScreen";
import OtpScreen from "./src/screens/OtpScreen";
import MagicLinkScreen from "./src/screens/MagicLinkScreen";

type AuthStep = "email" | "otp" | "magic-link";

function Root() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authStep, setAuthStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");

  if (isLoading) return null;

  if (isAuthenticated) return <AppNavigator />;

  switch (authStep) {
    case "email":
      return (
        <EmailScreen
          onNext={(e) => {
            setEmail(e);
            setAuthStep("otp");
          }}
        />
      );
    case "otp":
      return (
        <OtpScreen
          email={email}
          onNext={() => setAuthStep("magic-link")}
          onBack={() => setAuthStep("email")}
        />
      );
    case "magic-link":
      return (
        <MagicLinkScreen
          email={email}
          onBack={() => setAuthStep("otp")}
        />
      );
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

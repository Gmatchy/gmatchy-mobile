import { AuthContext, AuthProvider } from "@/contexts/auth-context";
import { useAppInit } from "@/hooks/use-app-init";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useContext } from "react";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}

function RootNavigation() {
  const colorScheme = useColorScheme();
  const isAppReady = useAppInit();
  const { isLoading, isAuth } = useContext(AuthContext);

  if (!isAppReady || isLoading) {
    return null; // keep splash screen visible
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuth ? <Stack.Screen name="main" /> : <Stack.Screen name="auth" />}
      </Stack>
    </ThemeProvider>
  );
}

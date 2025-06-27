import { StyleSheet } from "react-native";

import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AuthContext } from "@/contexts/auth-context";
import { loginRequest } from "@/services/remote/auth.api";
import { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const authContext = useContext(AuthContext);
  console.log("print login");
  const submit = async () => {
    try {
      const { refreshToken, accessToken } = await loginRequest({
        phone: "+971501231234",
        password: "12345678",
      });
      authContext.signIn(accessToken, refreshToken);
    } catch (error) {
      console.log("Error While Login: ", error);
    }
  };
  return (
    <SafeAreaView>
      <ThemedView>
        <ThemedText>Login</ThemedText>
        <ThemedButton title="clock" onPress={submit} />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

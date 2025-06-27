import { StyleSheet } from "react-native";

import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AuthContext } from "@/contexts/auth-context";
import { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { signOut } = useContext(AuthContext);
  return (
    <SafeAreaView>
      <ThemedView>
        <ThemedText>Hello Gmathcy-Home</ThemedText>
        <ThemedButton title="logout" onPress={signOut} />
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

import { Pressable, Text, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedButtonProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  title: string;
  onPress: () => void;
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  onPress,
  title,
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <Pressable
      onPress={onPress}
      style={[
        { backgroundColor, paddingHorizontal: 8, paddingVertical: 4 },
        style,
      ]}
    >
      <Text>{title}</Text>
    </Pressable>
  );
}

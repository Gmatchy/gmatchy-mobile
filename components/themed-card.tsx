import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View, type ViewProps } from "react-native";

export type ThemedCardProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  borderRadius?: number;
  padding?: number;
  elevation?: number; // for Android shadow
  shadow?: boolean; // for iOS shadow
};

export function ThemedCard({
  style,
  lightColor,
  darkColor,
  borderRadius = 12,
  padding = 16,
  elevation = 4,
  shadow = true,
  ...otherProps
}: ThemedCardProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <View
      style={[
        {
          backgroundColor,
          borderRadius,
          padding,
          ...(shadow ? styles.shadow : {}),
          ...(elevation ? { elevation } : {}),
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

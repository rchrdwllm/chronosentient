import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { TEXT_PRIMARY, useThemeColors } from "@/constants/colors";

export type TextProps = RNTextProps & {
  weight?: "regular" | "medium" | "bold";
  children: React.ReactNode;
};

export default function Text({
  weight = "regular",
  style,
  children,
  ...props
}: TextProps) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });
  const colors = useThemeColors();

  if (!fontsLoaded) {
    return null;
  }

  let fontFamily =
    weight === "bold"
      ? "Inter_700Bold"
      : weight === "medium"
        ? "Inter_500Medium"
        : "Inter_400Regular";

  return (
    <RNText
      style={[{ fontFamily, color: colors.text.primary }, style]}
      {...props}
    >
      {children}
    </RNText>
  );
}

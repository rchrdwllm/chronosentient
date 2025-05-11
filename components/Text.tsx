import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { TEXT_PRIMARY, useThemeColors } from "@/constants/colors";
import { useFont } from "@/context/FontContext";

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
  const { fontScale } = useFont();

  if (!fontsLoaded) {
    return null;
  }

  let fontFamily =
    weight === "bold"
      ? "Inter_700Bold"
      : weight === "medium"
        ? "Inter_500Medium"
        : "Inter_400Regular";

  // Apply font scale to the base font size
  const applyFontScale = (style: any): any => {
    if (!style) return {};
    if (Array.isArray(style)) {
      return style.map(applyFontScale);
    }
    if (style.fontSize) {
      return {
        ...style,
        fontSize: style.fontSize * fontScale,
      };
    }
    return style;
  };

  const scaledStyle = applyFontScale(style);

  return (
    <RNText
      style={[
        {
          fontFamily,
          color: colors.text.primary,
          fontSize: 14 * fontScale, // Default size with scaling
        },
        scaledStyle,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

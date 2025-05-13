import BottomNavigation from "@/components/BottomNavigation";
import { FontProvider } from "@/context/FontContext";
import { ThemeProvider, useSystemBars, useTheme } from "@/context/ThemeContext";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View } from "react-native";

function AppLayout() {
  const { colors } = useTheme();
  const { statusBarProps } = useSystemBars();
  const backgroundColor = colors.background.main;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar
        backgroundColor={statusBarProps.backgroundColor}
        style={statusBarProps.style}
        translucent={statusBarProps.translucent}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor },
        }}
      />
      <BottomNavigation />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <FontProvider>
        <AppLayout />
      </FontProvider>
    </ThemeProvider>
  );
}

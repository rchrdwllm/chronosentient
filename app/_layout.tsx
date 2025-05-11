import { Stack } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { SplashScreen } from "expo-router";
import React, { useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { View, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme, useSystemBars } from "@/context/ThemeContext";

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
      <AppLayout />
    </ThemeProvider>
  );
}

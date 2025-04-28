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
import { View } from "react-native";
import { BACKGROUND_MAIN } from "@/constants/colors";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      // Set system UI background color (affects status and navigation bars on Android)
      SystemUI.setBackgroundColorAsync(BACKGROUND_MAIN);
      // Set Android navigation bar color
      NavigationBar.setBackgroundColorAsync(BACKGROUND_MAIN);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_MAIN }}>
      <StatusBar backgroundColor={BACKGROUND_MAIN} style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <BottomNavigation />
    </View>
  );
}

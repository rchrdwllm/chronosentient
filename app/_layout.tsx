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
    <View style={{ flex: 1, backgroundColor: BACKGROUND_MAIN }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      {/* Bottom navigation is rendered above all screens for now */}
      <BottomNavigation />
    </View>
  );
}

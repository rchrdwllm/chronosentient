import React, { useRef } from "react";
import { View, StyleSheet, Animated, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Home, Plus, List, ChartSpline, Settings2 } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";
import {
  PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  TEXT_WHITE,
  BACKGROUND_MAIN,
  GRADIENT_TRANSPARENT,
} from "@/constants/colors";

const TABS = [
  { key: "home", icon: Home, route: "/" },
  { key: "stats", icon: ChartSpline, route: "/stats" },
  { key: "add", icon: Plus, route: "/add" },
  { key: "list", icon: List, route: "/list" },
  { key: "settings", icon: Settings2, route: "/settings" },
];

function AnimatedTabButton({ style, children, ...props }: any) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.containerWrapper}>
      <LinearGradient
        colors={[GRADIENT_TRANSPARENT, BACKGROUND_MAIN]}
        style={styles.gradient}
        pointerEvents="none"
      />
      <View style={styles.container}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.route;
          const iconColor = isActive ? TEXT_SECONDARY : TEXT_TERTIARY;
          const bgStyle =
            tab.key === "add" ? styles.addButton : styles.tabButton;

          return (
            <AnimatedTabButton
              key={tab.key}
              style={bgStyle}
              activeOpacity={0.7}
              onPress={() => {
                if (!isActive) {
                  router.push(tab.route as any);
                }
              }}
            >
              <Icon
                color={tab.key === "add" ? TEXT_WHITE : iconColor}
                size={28}
              />
            </AnimatedTabButton>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    backgroundColor: BACKGROUND_MAIN,
    position: "relative",
  },
  gradient: {
    position: "absolute",
    top: -64,
    left: 0,
    right: 0,
    height: 64,
    zIndex: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 12,
    backgroundColor: BACKGROUND_MAIN,
    zIndex: 2,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: PRIMARY,
    borderRadius: 10,
    height: 52,
    width: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});

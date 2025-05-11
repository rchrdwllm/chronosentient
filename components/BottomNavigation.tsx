import React, { useRef } from "react";
import { View, StyleSheet, Animated, Pressable, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Home, Plus, List, ChartSpline, Settings2 } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";
import { useTheme, useSystemBars } from "@/context/ThemeContext";

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
  const { colors, theme } = useTheme();
  const { isDark } = useSystemBars();

  return (
    <View style={[
      styles.containerWrapper, 
      { 
        backgroundColor: colors.background.main,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0 
      }
    ]}>
      <LinearGradient
        colors={[colors.gradients.transparent, colors.background.main]}
        style={styles.gradient}
        pointerEvents="none"
      />
      <View style={[
        styles.container, 
        { 
          backgroundColor: colors.background.main,
          borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
        }
      ]}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.route;
          const iconColor = isActive ? colors.text.secondary : colors.text.tertiary;
          const bgStyle =
            tab.key === "add" ? [styles.addButton, { backgroundColor: colors.primary }] : styles.tabButton;

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
                color={tab.key === "add" ? colors.text.white : iconColor}
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
    position: "relative",
    elevation: 8,
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
    zIndex: 2,
    borderTopWidth: 1,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    borderRadius: 10,
    height: 52,
    width: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});

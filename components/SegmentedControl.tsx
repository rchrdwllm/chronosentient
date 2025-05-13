import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const SEGMENTS = ["Week", "Month"];

export default function SegmentedControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { colors, theme } = useTheme();
  const indicatorX = useRef(new Animated.Value(0)).current;
  const animatedIndex = useRef(
    new Animated.Value(SEGMENTS.indexOf(value))
  ).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [segmentWidth, setSegmentWidth] = React.useState(0);
  const selectedIndex = SEGMENTS.indexOf(value);

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: selectedIndex * segmentWidth,
      useNativeDriver: true,
      speed: 8,
      bounciness: 2,
    }).start();
    Animated.timing(animatedIndex, {
      toValue: selectedIndex,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [selectedIndex, segmentWidth]);

  const handlePressIn = (i: number) => {
    if (i === selectedIndex) {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 12,
        bounciness: 2,
      }).start();
    }
  };

  const handlePressOut = (i: number) => {
    if (i === selectedIndex) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 2,
      }).start();
    }
  };

  const onLayout = (e: LayoutChangeEvent) => {
    setSegmentWidth(e.nativeEvent.layout.width / SEGMENTS.length);
  };

  return (
    <View
      style={[
        styles.segmentedContainer,
        { backgroundColor: theme === "dark" ? "#3A3A42" : "#ECECEC" },
      ]}
      onLayout={onLayout}
    >
      {segmentWidth > 0 && (
        <Animated.View
          style={[
            styles.activeBg,
            {
              width: segmentWidth - 4,
              transform: [{ translateX: indicatorX }, { scale }],
              backgroundColor: theme === "dark" ? "#2D2D35" : "#fff",
            },
          ]}
        />
      )}
      {SEGMENTS.map((v, i) => {
        const color = animatedIndex.interpolate({
          inputRange: [0, 1],
          outputRange:
            i === 0
              ? [colors.text.primary, colors.text.tertiary]
              : [colors.text.tertiary, colors.text.primary],
        });
        return (
          <Pressable
            key={v}
            onPress={() => onChange(v)}
            onPressIn={() => handlePressIn(i)}
            onPressOut={() => handlePressOut(i)}
            style={styles.segment}
          >
            <Animated.Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 15,
                color,
              }}
            >
              {v}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: "#ECECEC",
    borderRadius: 16,
    marginVertical: 16,
    alignSelf: "center",
    position: "relative",
    overflow: "hidden",
  },
  segment: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: 16,
    zIndex: 1,
  },
  activeBg: {
    position: "absolute",
    top: 2,
    bottom: 2,
    left: 2,
    backgroundColor: "#fff",
    borderRadius: 14,
    zIndex: 0,
    height: "90%",
  },
});

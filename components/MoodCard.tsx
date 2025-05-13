import Text from "@/components/Text";
import { useTheme } from "@/context/ThemeContext";
import { Trash2 } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

export type MoodCardProps = {
  day: string;
  mood: "Positive" | "Negative";
  emoji: string;
  text: string;
  onPress?: () => void;
  onDelete?: () => void;
};

export default function MoodCard({
  day,
  mood,
  emoji,
  text,
  onPress,
  onDelete,
}: MoodCardProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const showTrash = useRef(new Animated.Value(0)).current;
  const SWIPE_THRESHOLD = -100;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
          showTrash.setValue(Math.min(1, Math.abs(gestureState.dx) / 80));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: -400,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onDelete && onDelete();
          });
        } else {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.timing(showTrash, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  return (
    <View style={{ position: "relative" }}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.trashContainer,
          {
            opacity: showTrash,
            right: 24,
            transform: [
              {
                scale: showTrash.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.trashCircle,
            { backgroundColor: colors.negative, shadowColor: colors.negative },
          ]}
        >
          <Trash2 color={colors.text.white} size={22} />
        </View>
      </Animated.View>
      <Animated.View
        style={[{ transform: [{ translateX }, { scale }], opacity }]}
        {...panResponder.panHandlers}
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colors.background.main === "#1A1A1F" ? "#2D2D35" : "#fff",
                shadowColor: colors.shadow,
              },
            ]}
          >
            <View style={[styles.cardHeader]}>
              <Text
                weight="bold"
                style={[styles.day, { color: colors.text.primary }]}
              >
                {day}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.text, { color: colors.text.tertiary }]}
              >
                {text}
              </Text>
            </View>
            <View style={styles.sentimentContainer}>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={[
                    styles.mood,
                    {
                      color:
                        mood === "Positive" ? colors.primary : colors.negative,
                    },
                  ]}
                >
                  {mood}
                </Text>
                <Text style={styles.emoji}>{emoji}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: "row",
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardHeader: {
    flex: 1,
  },
  day: {
    fontSize: 16,
    flex: 1,
  },
  mood: {
    fontSize: 13,
    marginRight: 8,
  },
  sentimentContainer: {
    width: 64,
  },
  positive: {
    // Color now applied dynamically
  },
  negative: {
    // Color now applied dynamically
  },
  emoji: {
    fontSize: 32,
    marginLeft: 2,
  },
  text: {
    fontSize: 14,
    marginLeft: 2,
  },
  positiveCard: {},
  negativeCard: {},
  trashContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  trashCircle: {
    backgroundColor: "#E05C71", // Default value, will be overridden with colors.negative
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E05C71", // Default value, will be overridden with colors.negative
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});

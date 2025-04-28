import React, { useRef } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import Text from "@/components/Text";
import { NEGATIVE, PRIMARY, TEXT_TERTIARY } from "@/constants/colors";

export type MoodCardProps = {
  day: string;
  mood: "Positive" | "Negative";
  emoji: string;
  text: string;
  onPress?: () => void;
};

export default function MoodCard({
  day,
  mood,
  emoji,
  text,
  onPress,
}: MoodCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

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
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.card,
          mood === "Positive" ? styles.positiveCard : styles.negativeCard,
          { transform: [{ scale }] },
        ]}
      >
        <View style={[styles.cardHeader]}>
          <Text weight="bold" style={styles.day}>
            {day}
          </Text>
          <Text numberOfLines={1} style={styles.text}>
            {text}
          </Text>
        </View>
        <View style={styles.sentimentContainer}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.mood,
                mood === "Positive" ? styles.positive : styles.negative,
              ]}
            >
              {mood}
            </Text>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: "row",
  },
  cardHeader: {
    flex: 1,
  },
  day: {
    fontSize: 16,
    flex: 1,
    color: "#25283D",
  },
  mood: {
    fontSize: 13,
    marginRight: 8,
  },
  sentimentContainer: {
    width: 64,
  },
  positive: {
    color: PRIMARY,
  },
  negative: {
    color: NEGATIVE,
  },
  emoji: {
    fontSize: 32,
    marginLeft: 2,
  },
  text: {
    color: TEXT_TERTIARY,
    fontSize: 14,
    marginLeft: 2,
  },
  positiveCard: {
    // Optionally add a subtle border or shadow for positive
  },
  negativeCard: {
    // Optionally add a subtle border or shadow for negative
  },
});

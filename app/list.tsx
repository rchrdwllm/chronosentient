import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Text from "@/components/Text";
import MoodCard from "@/components/MoodCard";
import { BACKGROUND_MAIN, TEXT_TERTIARY, PRIMARY } from "@/constants/colors";

const WEEK_DATA = [
  {
    day: "Sunday",
    mood: "Positive",
    emoji: "🙂",
    text: "Today has been a really hard day. But...",
  },
  {
    day: "Monday",
    mood: "Negative",
    emoji: "🙁",
    text: "Today has been a really hard day. But...",
  },
  {
    day: "Tuesday",
    mood: "Negative",
    emoji: "🙁",
    text: "Today has been a really hard day. But...",
  },
  {
    day: "Wednesday",
    mood: "Positive",
    emoji: "🙂",
    text: "Today has been a really hard day. But...",
  },
  {
    day: "Thursday",
    mood: "Positive",
    emoji: "🙂",
    text: "Today has been a really hard day. But...",
  },
  {
    day: "Friday",
    mood: "Negative",
    emoji: "🙁",
    text: "Today has been a really hard day. But...",
  },
  {
    day: "Saturday",
    mood: "Negative",
    emoji: "🙁",
    text: "Today has been a really hard day. But...",
  },
];

export default function ListScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_MAIN, paddingTop: 56 }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text weight="bold" style={styles.heading}>
          This week
        </Text>
        {WEEK_DATA.map((entry, idx) => (
          <MoodCard
            key={entry.day}
            day={entry.day}
            mood={entry.mood as "Positive" | "Negative"}
            emoji={entry.emoji}
            text={entry.text}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
    marginBottom: 24,
    color: "#25283D",
    marginLeft: 4,
  },
});

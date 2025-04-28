import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Text from "@/components/Text";
import MoodCard from "@/components/MoodCard";
import { BACKGROUND_MAIN, TEXT_TERTIARY, PRIMARY } from "@/constants/colors";
import { WEEK_JOURNAL_ENTRIES } from "@/constants/journalData";

export default function ListScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_MAIN, paddingTop: 56 }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text weight="bold" style={styles.heading}>
          This week
        </Text>
        {WEEK_JOURNAL_ENTRIES.map((entry, idx) => (
          <MoodCard
            key={entry.day}
            day={entry.day}
            mood={entry.mood as "Positive" | "Negative"}
            emoji={entry.emoji}
            text={entry.text}
            onPress={() =>
              router.push({
                pathname: "/entry-details",
                params: entry,
              })
            }
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

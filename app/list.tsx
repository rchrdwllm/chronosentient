import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Text from "@/components/Text";
import MoodCard from "@/components/MoodCard";
import { BACKGROUND_MAIN } from "@/constants/colors";
import { useJournalStore } from "@/stores/journalStore";

export default function ListScreen() {
  const router = useRouter();
  const entries = useJournalStore((state) => state.entries);
  const deleteEntry = useJournalStore((state) => state.deleteEntry);

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_MAIN, paddingTop: 56 }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text weight="bold" style={styles.heading}>
          This week
        </Text>
        {entries.map((entry, idx) => (
          <MoodCard
            key={entry.id}
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
            onDelete={() => deleteEntry(entry.date)}
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

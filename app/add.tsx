import React, { useState, useMemo } from "react";
import { View, StyleSheet, Animated, Pressable, TextInput } from "react-native";
import Text from "@/components/Text";
import { useRouter } from "expo-router";
import { ChevronLeft, Check } from "lucide-react-native";
import {
  BACKGROUND_MAIN,
  TEXT_SECONDARY,
  PRIMARY,
  TEXT_PRIMARY,
  TEXT_LIGHT,
  TEXT_TERTIARY,
  BACKGROUND_TRANSPARENT,
  SHADOW_COLOR,
} from "@/constants/colors";
import { useJournalStore } from "@/stores/journalStore";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import vader from "vader-sentiment";

function getTodayString() {
  const today = new Date();
  return today.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function AnimatedIconButton({ onPress, children, style }: any) {
  const scale = React.useRef(new Animated.Value(1)).current;

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
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, style]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function AddScreen() {
  const router = useRouter();
  const [entry, setEntry] = useState("");
  const addEntry = useJournalStore((state) => state.addEntry);
  const entries = useJournalStore((state) => state.entries);

  const todayDateStringForComparison = useMemo(() => {
    // We need to compare the date part of the ISO string.
    // new Date().toISOString() gives 'YYYY-MM-DDTHH:mm:ss.sssZ'
    // The date stored in journal entries is also an ISOString.
    return new Date().toISOString().split("T")[0];
  }, []);

  const hasEntryForToday = useMemo(() => {
    return entries.some((e) => e.date.startsWith(todayDateStringForComparison));
  }, [entries, todayDateStringForComparison]);

  const handleAdd = () => {
    if (!entry.trim()) return;

    const today = new Date();
    const isoDate = today.toISOString();
    const dayOfWeek = today.toLocaleDateString(undefined, { weekday: "long" });

    const sentiment = vader.SentimentIntensityAnalyzer.polarity_scores(entry);

    console.log("Sentiment Analysis Result:", sentiment);

    const mood =
      sentiment.compound >= 0.05
        ? "Positive"
        : sentiment.compound > -0.05
        ? "Neutral"
        : "Negative";
    const emoji = mood === "Positive" ? "😊" : mood === "Neutral" ? "😐" : "😢";

    const newEntry = {
      id: uuidv4(),
      date: isoDate,
      day: dayOfWeek,
      mood,
      emoji,
      text: entry,
    };

    addEntry(newEntry);

    router.push({
      pathname: "/entry-details",
      params: newEntry,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_MAIN }}>
      <View style={styles.header}>
        <AnimatedIconButton
          onPress={() => router.back()}
          style={styles.headerIcon}
        >
          <ChevronLeft color={TEXT_SECONDARY} size={28} />
        </AnimatedIconButton>
        <Text weight="medium" style={styles.headerTitle}>
          {getTodayString()}
        </Text>
        {hasEntryForToday ? (
          <View style={styles.headerIcon} /> // Empty view to maintain spacing and alignment
        ) : (
          <AnimatedIconButton style={styles.headerIcon} onPress={handleAdd}>
            <Check color={PRIMARY} size={26} />
          </AnimatedIconButton>
        )}
      </View>
      {hasEntryForToday ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            You already have added an entry for this day.
          </Text>
        </View>
      ) : (
        <>
          <Text weight="bold" style={styles.prompt}>
            Anong ganap mo today, fella?
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Start writing your journal entry..."
            placeholderTextColor={TEXT_TERTIARY}
            value={entry}
            onChangeText={setEntry}
            textAlignVertical="top"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: BACKGROUND_MAIN,
  },
  headerIcon: {
    width: 32,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    color: TEXT_PRIMARY,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  prompt: {
    fontSize: 20,
    color: TEXT_LIGHT,
    textAlign: "center",
    marginTop: 80,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 20,
    fontSize: 16,
    lineHeight: 40,
    color: TEXT_SECONDARY,
    fontFamily: "Inter_400Regular",
    backgroundColor: BACKGROUND_TRANSPARENT,
    shadowColor: SHADOW_COLOR,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  messageText: {
    fontSize: 18,
    color: TEXT_SECONDARY,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
});

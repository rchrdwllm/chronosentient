import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Text from "@/components/Text";
import vader from "vader-sentiment";
import { ChevronLeft, Trash2, Check } from "lucide-react-native";
import {
  BACKGROUND_MAIN,
  TEXT_PRIMARY,
  TEXT_TERTIARY,
  PRIMARY,
  TEXT_SECONDARY,
  NEGATIVE,
} from "@/constants/colors";
import { useJournalStore } from "@/stores/journalStore";

function AnimatedIconButton({ onPress, children, style }: any) {
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
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ justifyContent: "center", alignItems: "center" }}
        android_ripple={{ color: "#ccc", borderless: true }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function EntryDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { day, mood, emoji, text, date } = params;
  const [entryText, setEntryText] = React.useState(text?.toString() || "");
  const updateEntry = useJournalStore((state) => state.updateEntry);
  const deleteEntry = useJournalStore((state) => state.deleteEntry);

  // Format the date string (e.g., "April 22, 2025")
  let formattedDate = "";
  let formattedTime = "";

  if (date) {
    const d = new Date(date.toString());
    formattedDate = d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    formattedTime = d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Determine if entry is editable (only if today is the same as entry date)
  let isEditable = false;
  if (date) {
    const entryDate = new Date(date.toString());
    const now = new Date();
    isEditable =
      entryDate.getFullYear() === now.getFullYear() &&
      entryDate.getMonth() === now.getMonth() &&
      entryDate.getDate() === now.getDate();
  }

  const handleUpdate = () => {
    if (!date) return;

    const sentiment = vader.SentimentIntensityAnalyzer.polarity_scores(entryText);
    const newMood =
      sentiment.compound >= 0.05
        ? "Positive"
        : sentiment.compound > -0.05
        ? "Neutral"
        : "Negative";
    const newEmoji = newMood === "Positive" ? "😊" : newMood === "Neutral" ? "😐" : "😢";

    updateEntry(date.toString(), { text: entryText, mood: newMood, emoji: newEmoji });
    router.back();
  };

  const handleDelete = () => {
    if (!date) return;
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteEntry(date.toString());
            router.replace("/list");
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_MAIN }}>
      <View style={styles.header}>
        <AnimatedIconButton onPress={() => router.back()}>
          <ChevronLeft color={TEXT_TERTIARY} size={28} />
        </AnimatedIconButton>
        {formattedTime ? (
          <Text style={styles.headerTime}>{formattedTime}</Text>
        ) : null}
        <View style={styles.headerActions}>
          <AnimatedIconButton onPress={handleDelete}>
            <Trash2 color={TEXT_TERTIARY} size={22} />
          </AnimatedIconButton>
          <AnimatedIconButton onPress={handleUpdate}>
            <Check color={PRIMARY} size={22} />
          </AnimatedIconButton>
        </View>
      </View>
      <View style={styles.content}>
        <Text
          style={[
            styles.sentiment,
            {
              color:
                mood?.toString().toLowerCase() === "negative"
                  ? NEGATIVE
                  : PRIMARY,
            },
          ]}
          weight="medium"
        >
          {mood?.toString().toUpperCase()}
        </Text>
        <Text weight="bold" style={styles.day}>
          {day} {emoji}
        </Text>
        {formattedDate ? (
          <Text style={styles.date}>{formattedDate}</Text>
        ) : null}
        <TextInput
          style={styles.textInput}
          multiline
          value={entryText}
          onChangeText={setEntryText}
          placeholder="Edit your journal entry..."
          placeholderTextColor={TEXT_TERTIARY}
          textAlignVertical="top"
          editable={isEditable}
        />
        {!isEditable && (
          <Text
            style={{
              color: TEXT_TERTIARY,
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            You can only edit entries on the day they were created.
          </Text>
        )}
      </View>
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerTime: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 16,
    color: TEXT_TERTIARY,
    top: 60,
    zIndex: 0,
    pointerEvents: "none",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sentiment: {
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 8,
  },
  day: {
    fontSize: 28,
    marginBottom: 0,
    color: TEXT_PRIMARY,
  },
  date: {
    fontSize: 16,
    color: TEXT_TERTIARY,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: TEXT_TERTIARY,
    lineHeight: 26,
  },
  textInput: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    lineHeight: 40,
    marginTop: 16,
    padding: 0,
    backgroundColor: "transparent",
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
});

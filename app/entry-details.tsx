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
import { useTheme } from "@/context/ThemeContext";
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
  const { colors } = useTheme();
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

    const sentiment =
      vader.SentimentIntensityAnalyzer.polarity_scores(entryText);
    const newMood =
      sentiment.compound >= 0.05
        ? "Positive"
        : sentiment.compound > -0.05
          ? "Neutral"
          : "Negative";
    const newEmoji =
      newMood === "Positive" ? "😊" : newMood === "Neutral" ? "😐" : "😢";

    updateEntry(date.toString(), {
      text: entryText,
      mood: newMood,
      emoji: newEmoji,
    });
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
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.main }}>
      <View style={[styles.header, { backgroundColor: colors.background.main }]}>
        <AnimatedIconButton
          style={styles.headerBackBtn}
          onPress={() => router.back()}
        >
          <ChevronLeft color={colors.text.tertiary} size={28} />
        </AnimatedIconButton>
        {formattedTime ? (
          <Text style={[styles.headerTime, { color: colors.text.tertiary }]}>{formattedTime}</Text>
        ) : null}
        <View style={styles.headerActions}>
          <AnimatedIconButton onPress={handleDelete}>
            <Trash2 color={colors.text.tertiary} size={22} />
          </AnimatedIconButton>
          <AnimatedIconButton onPress={handleUpdate}>
            <Check color={colors.primary} size={22} />
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
                  ? colors.negative
                  : colors.primary,
            },
          ]}
          weight="medium"
        >
          {mood?.toString().toUpperCase()}
        </Text>
        <Text weight="bold" style={[styles.day, { color: colors.text.primary }]}>
          {day} {emoji}
        </Text>
        {formattedDate ? (
          <Text style={[styles.date, { color: colors.text.tertiary }]}>{formattedDate}</Text>
        ) : null}
        <TextInput
          style={[styles.textInput, { color: colors.text.secondary }]}
          multiline
          value={entryText}
          onChangeText={setEntryText}
          placeholder="Edit your journal entry..."
          placeholderTextColor={colors.text.tertiary}
          textAlignVertical="top"
          editable={isEditable}
        />
        {!isEditable && (
          <Text
            style={{
              color: colors.text.tertiary,
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
  },
  headerBackBtn: {
    zIndex: 1,
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
  },
  date: {
    fontSize: 16,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 26,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 40,
    marginTop: 16,
    padding: 0,
    backgroundColor: "transparent",
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
});

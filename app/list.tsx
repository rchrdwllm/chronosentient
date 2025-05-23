import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import Text from "@/components/Text";
import MoodCard from "@/components/MoodCard";
import { useTheme } from "@/context/ThemeContext";
import { useJournalStore } from "@/stores/journalStore";

function AnimatedArrowButton({
  onPress,
  children,
}: {
  onPress: () => void;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.85,
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
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.arrowBtn}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function ListScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { entries, deleteEntry, initialize, isInitialized } = useJournalStore();
  const [weekOffset, setWeekOffset] = React.useState(0); // 0 = this week
  
  // Make sure store is initialized when the component mounts
  React.useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Calculate the start and end of the current week (Sunday to Saturday), with offset
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + weekOffset * 7);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  // Format week range for display
  function formatWeekRange(start: Date, end: Date) {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const startStr = start.toLocaleDateString(undefined, options);
    const endStr = end.toLocaleDateString(undefined, {
      ...options,
      year: start.getFullYear() !== end.getFullYear() ? "numeric" : undefined,
    });
    const yearStr = end.getFullYear();
    return `${startStr} – ${endStr}, ${yearStr}`;
  }
  const weekRangeLabel =
    weekOffset === 0 ? "This week" : formatWeekRange(weekStart, weekEnd);

  // Filter entries for the current week
  const weekEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.main, paddingTop: 56 }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.weekHeaderRow}>
          <Text weight="bold" style={[styles.heading, { color: colors.text.primary }]}>
            {weekRangeLabel}
          </Text>
          <View style={styles.arrowsContainer}>
            <AnimatedArrowButton onPress={() => setWeekOffset((w) => w - 1)}>
              <ChevronLeft color={colors.text.tertiary} size={22} />
            </AnimatedArrowButton>
            <AnimatedArrowButton onPress={() => setWeekOffset((w) => w + 1)}>
              <ChevronRight color={colors.text.tertiary} size={22} />
            </AnimatedArrowButton>
          </View>
        </View>
        {weekEntries.length === 0 ? (
          <Text style={[styles.noEntriesText, { color: colors.text.tertiary }]}>No entries for this week.</Text>
        ) : (
          weekEntries.map((entry, idx) => (
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
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
    marginLeft: 4,
    flex: 1,
    textAlign: "left",
  },
  weekHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  arrowsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  arrowBtn: {
    padding: 8,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  noEntriesText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 32,
    marginBottom: 24,
  },
});

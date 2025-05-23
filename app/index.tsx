import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  Button,
  useColorScheme,
} from "react-native";
import Text from "@/components/Text";
import CircularProgress from "@/components/CircularProgress";
import { useThemeColors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useJournalStore } from "@/stores/journalStore";
import { useRouter } from "expo-router";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

// Generate a unique ID for each gradient
const generateUniqueId = () =>
  `grad-${Math.random().toString(36).substr(2, 9)}`;

function SentimentBar() {
  const colors = useThemeColors();
  // Create a unique gradient ID for this component instance
  const gradientId = React.useMemo(() => generateUniqueId(), []);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(weekStart.getDate() - 7);
  const lastWeekEnd = new Date(weekEnd);
  lastWeekEnd.setDate(weekEnd.getDate() - 7);

  const entries = useJournalStore((state) => state.entries);

  const weekEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });
  const lastWeekEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= lastWeekStart && entryDate <= lastWeekEnd;
  });

  const weekPositive = weekEntries.filter((e) => e.mood === "Positive").length;
  const lastWeekPositive = lastWeekEntries.filter(
    (e) => e.mood === "Positive",
  ).length;
  const weekTotal = weekEntries.length || 1;
  const lastWeekTotal = lastWeekEntries.length || 1;
  const weekPercent = (weekPositive / weekTotal) * 100;
  const lastWeekPercent = (lastWeekPositive / lastWeekTotal) * 100;
  const diff = Math.round(weekPercent - lastWeekPercent);
  const diffText =
    diff > 0
      ? `${diff}% happier this week`
      : diff < 0
        ? `${Math.abs(diff)}% less happy this week`
        : `No change in happiness this week`;

  return (
    <View
      style={[
        styles.sentimentBarContainer,
        {
          backgroundColor:
            colors.background.main === "#1A1A1F" ? "#2D2D35" : "#fff",
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View
        style={[
          styles.sentimentBarBg,
          {
            backgroundColor: colors.background.main,
          },
        ]}
      >
        <Svg height="12" width="100%">
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <Stop
                offset="0"
                stopColor={
                  colors.background.main === "#1A1A1F" ? "#5AC271" : "#71E089"
                }
                stopOpacity="1"
              />
              <Stop offset="1" stopColor={colors.primary} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect
            width={`${Math.round(diff)}%`}
            height="12"
            fill={`url(#${gradientId})`}
            rx="6"
            ry="6"
          />
        </Svg>
      </View>
      <Text style={{ fontSize: 15 }}>
        {diff > 0 ? "😊" : diff < 0 ? "☹️" : "😐"}
      </Text>
    </View>
  );
}

function AnimatedCard({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  const colors = useThemeColors();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
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
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={[
          styles.animatedCard,
          {
            transform: [{ scale }],
            backgroundColor:
              colors.background.main === "#1A1A1F" ? "#2D2D35" : "#fff",
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function Index() {
  const colors = useThemeColors();
  const entries = useJournalStore((state) => state.entries);

  // Get entries for today, yesterday, and two days ago
  function getEntryForOffset(offset: number) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const dateKey = date.toISOString().slice(0, 10);
    return entries.find((e) => e.date.slice(0, 10) === dateKey);
  }
  const todayEntry = getEntryForOffset(0);
  const yesterdayEntry = getEntryForOffset(1);
  const twoDaysAgoEntry = getEntryForOffset(2);
  const router = useRouter();

  // Calculate sentiment counts for the week (Sunday to Saturday)
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(weekStart.getDate() - 7);
  const lastWeekEnd = new Date(weekEnd);
  lastWeekEnd.setDate(weekEnd.getDate() - 7);

  const weekEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });
  const lastWeekEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= lastWeekStart && entryDate <= lastWeekEnd;
  });

  const sentimentCounts = weekEntries.reduce(
    (acc, entry) => {
      if (entry.mood === "Positive") acc.positive++;
      else if (entry.mood === "Negative") acc.negative++;
      else acc.neutral++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 },
  );
  const total = weekEntries.length || 1;

  const weekPositive = weekEntries.filter((e) => e.mood === "Positive").length;
  const lastWeekPositive = lastWeekEntries.filter(
    (e) => e.mood === "Positive",
  ).length;
  const weekTotal = weekEntries.length || 1;
  const lastWeekTotal = lastWeekEntries.length || 1;
  const weekPercent = (weekPositive / weekTotal) * 100;
  const lastWeekPercent = (lastWeekPositive / lastWeekTotal) * 100;
  const diff = Math.round(weekPercent - lastWeekPercent);
  const diffText =
    diff > 0
      ? `${diff}% happier this week`
      : diff < 0
        ? `${Math.abs(diff)}% less happy this week`
        : `No change in happiness this week`;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.main }]}
    >
      <View style={{ width: "100%" }}>
        <Text
          weight="bold"
          style={[styles.welcome, { color: colors.text.primary }]}
        >
          Welcome back!
        </Text>
        <Text
          weight="medium"
          style={[styles.subtitle, { color: colors.text.tertiary }]}
        >
          This Week
        </Text>
      </View>
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
        <View style={styles.progressRow}>
          <CircularProgress
            percent={Math.round((sentimentCounts.positive / total) * 100)}
            color={colors.primary}
            label="Positive"
            useGradient={true}
            gradientColors={[
              colors.background.main === "#1A1A1F" ? "#5AC271" : "#71E089",
              colors.primary,
            ]}
          />
          <View style={styles.legendColumn}>
            <Text
              style={[styles.statPositive, { color: colors.primary }]}
              weight="bold"
            >
              {Math.round((sentimentCounts.positive / total) * 100)}%{"  "}
              <Text style={[styles.statLabel, { color: colors.text.primary }]}>
                Positive
              </Text>
            </Text>
            <Text
              style={[styles.statNeutral, { color: colors.text.tertiary }]}
              weight="bold"
            >
              {Math.round((sentimentCounts.neutral / total) * 100)}%{"  "}
              <Text style={[styles.statLabel, { color: colors.text.primary }]}>
                Neutral
              </Text>
            </Text>
            <Text
              style={[styles.statNegative, { color: colors.negative }]}
              weight="bold"
            >
              {Math.round((sentimentCounts.negative / total) * 100)}%{"  "}
              <Text style={[styles.statLabel, { color: colors.text.primary }]}>
                Negative
              </Text>
            </Text>
          </View>
        </View>
      </View>
      {/* Only render the segmentedRow if there is at least one entry */}
      {(twoDaysAgoEntry || yesterdayEntry || todayEntry) && (
        <View style={styles.segmentedRow}>
          {twoDaysAgoEntry && (
            <AnimatedCard
              onPress={() =>
                router.push({
                  pathname: "/entry-details",
                  params: twoDaysAgoEntry,
                })
              }
            >
              <Text weight="bold" style={{ color: colors.text.primary }}>
                Last 2 days
              </Text>
            </AnimatedCard>
          )}
          {yesterdayEntry && (
            <AnimatedCard
              onPress={() =>
                router.push({
                  pathname: "/entry-details",
                  params: yesterdayEntry,
                })
              }
            >
              <Text weight="bold" style={{ color: colors.text.primary }}>
                Yesterday
              </Text>
            </AnimatedCard>
          )}
          {todayEntry && (
            <AnimatedCard
              onPress={() =>
                router.push({ pathname: "/entry-details", params: todayEntry })
              }
            >
              <Text weight="bold" style={{ color: colors.text.primary }}>
                Today
              </Text>
            </AnimatedCard>
          )}
        </View>
      )}
      <SentimentBar />
      <Text
        style={{
          color: colors.text.tertiary,
          fontSize: 15,
          textAlign: "center",
          marginTop: 16,
          marginBottom: 20,
        }}
      >
        {diffText}
      </Text>
      {/* <Button
        title="Clear AsyncStorage"
        onPress={() => {
          AsyncStorage.clear();

          console.log("AsyncStorage cleared");
          alert("AsyncStorage cleared");
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  welcome: {
    fontSize: 32,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 18,
  },
  legendColumn: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 18,
    gap: 10, // add vertical gap between legend items
  },
  statPositive: { fontSize: 16, marginBottom: 2 },
  statNeutral: { fontSize: 16, marginBottom: 2 },
  statNegative: { fontSize: 16 },
  statLabel: { fontSize: 15 },
  segmentedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    marginTop: 2,
    gap: 10,
  },
  animatedCard: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  animatedCardActive: {
    // Will be controlled dynamically with colors.primary
  },
  sentimentBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 16,
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  sentimentBarBg: {
    flex: 1,
    height: 12,
    borderRadius: 8,
    marginRight: 8,
    overflow: "hidden",
    minWidth: 200,
  },
  sentimentBarLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
});

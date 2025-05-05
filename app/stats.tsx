import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "@/components/Text";
import {
  BACKGROUND_MAIN,
  PRIMARY,
  NEGATIVE,
  TEXT_TERTIARY,
  TEXT_LIGHT,
} from "@/constants/colors";
import SegmentedControl from "@/components/SegmentedControl";
import CircularProgress from "@/components/CircularProgress";
import BarChart from "@/components/BarChart";
import { useJournalStore } from "@/stores/journalStore";

export default function StatsScreen() {
  const [segment, setSegment] = React.useState("Week");
  const entries = useJournalStore((state) => state.entries);

  // Calculate sentiment counts
  const sentimentCounts = entries.reduce(
    (acc, entry) => {
      if (entry.mood === "Positive") acc.positive++;
      else if (entry.mood === "Negative") acc.negative++;
      else acc.neutral++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );
  const total = entries.length || 1;
  const progressData = [
    {
      percent: Math.round((sentimentCounts.positive / total) * 100),
      color: PRIMARY,
      label: "Positive",
    },
    {
      percent: Math.round((sentimentCounts.neutral / total) * 100),
      color: TEXT_TERTIARY,
      label: "Neutral",
    },
    {
      percent: Math.round((sentimentCounts.negative / total) * 100),
      color: NEGATIVE,
      label: "Negative",
    },
  ];

  // Always show all 7 days (S, M, T, W, T, F, S)
  const weekDays = [
    { key: "S", label: "Sunday" },
    { key: "M", label: "Monday" },
    { key: "T", label: "Tuesday" },
    { key: "W", label: "Wednesday" },
    { key: "T", label: "Thursday" },
    { key: "F", label: "Friday" },
    { key: "S", label: "Saturday" },
  ];
  // Map day label to entry
  const entryByDay = Object.fromEntries(
    entries.map((entry) => [entry.day, entry])
  );
  // Build barData for all days
  const barData = weekDays.map((d) => {
    const entry = entryByDay[d.label];
    if (entry) {
      return {
        day: d.key,
        sentiment: entry.mood as "Positive" | "Negative" | "Neutral",
      };
    } else {
      return {
        day: d.key,
        sentiment: "Missing" as const,
      };
    }
  });

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.header}>
        Statistics
      </Text>
      <View style={styles.segmentedControlContainer}>
        <SegmentedControl value={segment} onChange={setSegment} />
        <View style={styles.progressRow}>
          {progressData.map((item) => (
            <CircularProgress key={item.label} {...item} />
          ))}
        </View>
        <View style={styles.barChartContainer}>
          <Text weight="bold" style={styles.barChartTitle}>
            Journaling Sentiment
          </Text>
          <BarChart data={barData} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_MAIN,
    paddingTop: 56,
  },
  segmentedControlContainer: {
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 32,
    marginLeft: 24,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 18,
  },
  barChartContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 18,
    marginTop: 0,
  },
  barChartTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
});

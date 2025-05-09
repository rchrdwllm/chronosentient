import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
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
import { JournalEntry } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

export default function StatsScreen() {
  const [segment, setSegment] = React.useState("Week");
  const [weekOffset, setWeekOffset] = React.useState(0); // 0 = this week
  const [monthOffset, setMonthOffset] = React.useState(0); // 0 = this month
  const entries = useJournalStore((state) => state.entries);
  const router = useRouter();

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
  const weekRangeLabel = formatWeekRange(weekStart, weekEnd);

  // Filter entries for the current week
  const weekEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });

  // Calculate sentiment counts for the current week only
  const weekSentimentCounts = weekEntries.reduce(
    (acc, entry) => {
      if (entry.mood === "Positive") acc.positive++;
      else if (entry.mood === "Negative") acc.negative++;
      else acc.neutral++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );
  const weekTotal = weekEntries.length || 1;
  const progressData = [
    {
      percent: Math.round((weekSentimentCounts.positive / weekTotal) * 100),
      color: PRIMARY,
      label: "Positive",
    },
    {
      percent: Math.round((weekSentimentCounts.neutral / weekTotal) * 100),
      color: TEXT_TERTIARY,
      label: "Neutral",
    },
    {
      percent: Math.round((weekSentimentCounts.negative / weekTotal) * 100),
      color: NEGATIVE,
      label: "Negative",
    },
  ];

  // Map day label to entry for this week
  const entryByDay = Object.fromEntries(
    weekEntries.map((entry) => [entry.day, entry])
  );
  // Build barData for all days (show only this week's entries)
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

  // Month view logic
  const today = new Date();
  const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay(); // 0 (Sun) - 6 (Sat)

  // Month label for header
  const monthLabel = monthDate.toLocaleString(undefined, { month: "long", year: "numeric" });

  // Map entries by date string (YYYY-MM-DD)
  const entryByDate = Object.fromEntries(
    entries.map((entry) => {
      // Normalize to YYYY-MM-DD
      const dateKey = entry.date.slice(0, 10);
      return [dateKey, entry];
    })
  );

  // Filter entries for the current month
  const monthEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getFullYear() === year &&
      entryDate.getMonth() === month
    );
  });

  // Calculate sentiment counts for the current month only
  const monthSentimentCounts = monthEntries.reduce(
    (acc, entry) => {
      if (entry.mood === "Positive") acc.positive++;
      else if (entry.mood === "Negative") acc.negative++;
      else acc.neutral++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );
  const monthTotal = monthEntries.length || 1;
  const monthProgressData = [
    {
      percent: Math.round((monthSentimentCounts.positive / monthTotal) * 100),
      color: PRIMARY,
      label: "Positive",
    },
    {
      percent: Math.round((monthSentimentCounts.neutral / monthTotal) * 100),
      color: TEXT_TERTIARY,
      label: "Neutral",
    },
    {
      percent: Math.round((monthSentimentCounts.negative / monthTotal) * 100),
      color: NEGATIVE,
      label: "Negative",
    },
  ];

  // Build calendar grid: array of weeks, each week is array of days
  const calendarDays = [];
  let week = [];
  // Fill initial empty days
  for (let i = 0; i < startWeekday; i++) {
    week.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    week.push({
      day,
      entry: entryByDate[dateStr],
    });
    if (week.length === 7) {
      calendarDays.push(week);
      week = [];
    }
  }
  // Fill trailing empty days
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    calendarDays.push(week);
  }

  // Helper to get color by sentiment
  function getSentimentColor(entry: JournalEntry | undefined) {
    if (!entry) return "#eee";
    if (entry.mood === "Positive") return PRIMARY;
    if (entry.mood === "Negative") return NEGATIVE;
    if (entry.mood === "Neutral") return TEXT_TERTIARY;
    return "#eee";
  }

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.header}>
        Statistics
      </Text>
      <View style={styles.segmentedControlContainer}>
        <SegmentedControl value={segment} onChange={setSegment} />
        <View style={styles.progressRow}>
          {(segment === "Month" ? monthProgressData : progressData).map((item) => (
            <CircularProgress key={item.label} {...item} />
          ))}
        </View>
        {segment === "Month" ? (
          <View style={styles.calendarContainer}>
            <View style={styles.weekHeaderRow}>
              <Pressable onPress={() => setMonthOffset((m) => m - 1)} style={styles.arrowBtn}>
                <ChevronLeft color={TEXT_TERTIARY} size={22} />
              </Pressable>
              <Text weight="bold" style={styles.barChartTitle}>
                {monthLabel}
              </Text>
              <Pressable onPress={() => setMonthOffset((m) => m + 1)} style={styles.arrowBtn}>
                <ChevronRight color={TEXT_TERTIARY} size={22} />
              </Pressable>
            </View>
            {/* Weekday headers in a separate row */}
            <View style={styles.calendarHeaderRow}>
              {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                <Text key={idx} style={styles.calendarHeader}>
                  {d}
                </Text>
              ))}
            </View>
            {/* Calendar days grid */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((week, i) => (
                <View key={`week-${i}`} style={{ flexDirection: "row" }}>
                  {week.map((cell, j) =>
                    cell ? (
                      cell.entry ? (
                        <Pressable
                          key={`day-${i}-${j}`}
                          style={[
                            styles.calendarDay,
                            { backgroundColor: getSentimentColor(cell.entry) },
                          ]}
                          onPress={() =>
                            router.push({
                              pathname: "/entry-details",
                              params: cell.entry,
                            })
                          }
                        >
                          <Text style={styles.calendarDayText}>{cell.day}</Text>
                        </Pressable>
                      ) : (
                        <View key={`day-${i}-${j}`} style={styles.calendarDay}>
                          <Text
                            style={[
                              styles.calendarDayText,
                              styles.calendarDayTextMuted,
                            ]}
                          >
                            {cell.day}
                          </Text>
                        </View>
                      )
                    ) : (
                      <View
                        key={`empty-${i}-${j}`}
                        style={styles.calendarDay}
                      />
                    )
                  )}
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.barChartContainer}>
            <View style={styles.weekHeaderRow}>
              <Pressable
                onPress={() => setWeekOffset((w) => w - 1)}
                style={styles.arrowBtn}
              >
                <ChevronLeft color={TEXT_TERTIARY} size={22} />
              </Pressable>
              <Text weight="bold" style={styles.barChartTitle}>
                {weekRangeLabel}
              </Text>
              <Pressable
                onPress={() => setWeekOffset((w) => w + 1)}
                style={styles.arrowBtn}
              >
                <ChevronRight color={TEXT_TERTIARY} size={22} />
              </Pressable>
            </View>
            <BarChart data={barData} />
          </View>
        )}
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
    flex: 1,
  },
  weekHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  arrowBtn: {
    padding: 8,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginTop: 0,
  },
  calendarHeaderRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  calendarHeader: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: TEXT_LIGHT,
    marginBottom: 0,
  },
  calendarGrid: {
    width: "100%",
    paddingHorizontal: 8,
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
    margin: 4,
    minWidth: 0,
    maxWidth: 48,
  },
  calendarDayText: {
    fontSize: 14,
    color: BACKGROUND_MAIN,
  },
  calendarDayTextMuted: {
    color: TEXT_TERTIARY,
    fontWeight: "normal",
  },
  calendarEmoji: {
    fontSize: 16,
    textAlign: "center",
  },
  calendarMood: {
    fontSize: 12,
    textAlign: "center",
    color: TEXT_LIGHT,
  },
});

import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "@/components/Text";
import {
  BACKGROUND_MAIN,
  PRIMARY,
  NEGATIVE,
  TEXT_TERTIARY,
} from "@/constants/colors";
import SegmentedControl from "@/components/SegmentedControl";
import CircularProgress from "@/components/CircularProgress";
import BarChart from "@/components/BarChart";

export default function StatsScreen() {
  const [segment, setSegment] = React.useState("Week");

  const progressData = [
    { percent: 63, color: PRIMARY, label: "Positive" },
    { percent: 25, color: TEXT_TERTIARY, label: "Neutral" },
    { percent: 12, color: NEGATIVE, label: "Negative" },
  ];
  const barData = [
    { day: "S", sentiment: "Positive" },
    { day: "M", sentiment: "Negative" },
    { day: "T", sentiment: "Positive" },
    { day: "W", sentiment: "Negative" },
    { day: "T", sentiment: "Positive" },
    { day: "F", sentiment: "Negative" },
    { day: "S", sentiment: "Positive" },
  ] as { day: string; sentiment: "Positive" | "Negative" | "Neutral" }[];

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

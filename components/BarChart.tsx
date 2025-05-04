import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "@/components/Text";
import { PRIMARY, NEGATIVE, TEXT_TERTIARY } from "@/constants/colors";

export default function BarChart({
  data,
}: {
  data: { day: string; sentiment: "Positive" | "Negative" | "Neutral" }[];
}) {
  const colorMap = {
    Positive: PRIMARY,
    Negative: NEGATIVE,
    Neutral: TEXT_TERTIARY,
  };
  return (
    <View style={styles.container}>
      <View style={styles.barRow}>
        {data.map((item, idx) => (
          <View key={idx} style={styles.barItem}>
            <View
              style={[
                styles.bar,
                { backgroundColor: colorMap[item.sentiment] },
              ]}
            />
            <Text style={styles.dayLabel}>{item.day[0]}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: PRIMARY }]} />
          <Text style={styles.legendText}>Positive</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: NEGATIVE }]} />
          <Text style={styles.legendText}>Negative</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: TEXT_TERTIARY }]}
          />
          <Text style={styles.legendText}>Neutral</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 8,
  },
  barRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
    height: 120,
    alignItems: "flex-end",
  },
  barItem: {
    alignItems: "center",
  },
  bar: {
    width: 16,
    height: 100,
    borderRadius: 8,
    marginBottom: 6,
  },
  dayLabel: {
    fontSize: 13,
    color: TEXT_TERTIARY,
  },
  legendRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 18,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
  },
});

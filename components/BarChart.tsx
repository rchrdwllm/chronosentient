import Text from "@/components/Text";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function BarChart({
  data,
  theme,
}: {
  data: {
    day: string;
    sentiment: "Positive" | "Negative" | "Neutral" | "Missing";
  }[];
  theme?: string;
}) {
  const { colors: themeColors } = useTheme();
  const colors = useThemeColors();
  const colorMap = {
    Positive: themeColors.primary,
    Negative: themeColors.negative,
    Neutral: themeColors.text.tertiary,
    Missing: colors.background.main,
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
            <Text style={[styles.dayLabel, { color: colors.text.tertiary }]}>
              {item.day[0]}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: colors.primary }]}
          />
          <Text style={[styles.legendText, { color: colors.text.primary }]}>
            Positive
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: colors.negative }]}
          />
          <Text style={[styles.legendText, { color: colors.text.primary }]}>
            Negative
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: colors.text.tertiary },
            ]}
          />
          <Text style={[styles.legendText, { color: colors.text.primary }]}>
            Neutral
          </Text>
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

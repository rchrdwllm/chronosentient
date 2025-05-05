import React from "react";
import { View, StyleSheet } from "react-native";
import { Svg, Circle } from "react-native-svg";
import Text from "@/components/Text";
import { TEXT_LIGHT } from "@/constants/colors";

export default function CircularProgress({
  percent,
  color,
  label,
}: {
  percent: number;
  color: string;
  label: string;
}) {
  const radius = 32;
  const stroke = 7;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        <Circle
          stroke={TEXT_LIGHT}
          fill="none"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={stroke}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </Svg>
      <Text style={styles.percent} weight="bold">
        {percent}%
      </Text>
      <Text style={styles.label} weight="bold">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  percent: {
    fontSize: 16,
    marginTop: 4,
  },
  label: {
    fontSize: 15,
    marginTop: 2,
  },
});

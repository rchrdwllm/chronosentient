import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Svg,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import Text from "@/components/Text";
import { TEXT_LIGHT, useThemeColors } from "@/constants/colors";

// Generate a unique ID for each gradient
const generateUniqueId = () =>
  `grad-${Math.random().toString(36).substr(2, 9)}`;

export default function CircularProgress({
  percent,
  color,
  label,
  useGradient = false,
  gradientColors = ["#6ac1ff", "#71E089"],
}: {
  percent: number;
  color: string;
  label: string;
  useGradient?: boolean;
  gradientColors?: string[];
}) {
  // Create a unique gradient ID for this component instance
  const gradientId = React.useMemo(() => generateUniqueId(), []);
  const colors = useThemeColors();
  const radius = 32;
  const stroke = 7;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        {useGradient && (
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={gradientColors[0]} />
              <Stop offset="1" stopColor={gradientColors[1]} />
            </LinearGradient>
          </Defs>
        )}
        <Circle
          stroke={colors.background.main}
          fill="none"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={stroke}
        />
        <Circle
          stroke={useGradient ? `url(#${gradientId})` : color}
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
      <Text
        style={[styles.percent, { color: colors.text.primary }]}
        weight="bold"
      >
        {percent}%
      </Text>
      <Text style={[styles.label, { color: colors.text.primary }]}>
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
  percentContainer: {
    height: 25,
    marginTop: 4,
    alignSelf: "center",
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

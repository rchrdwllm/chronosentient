import React, { useRef } from "react";
import { View, StyleSheet, Animated, Pressable, Button } from "react-native";
import Text from "@/components/Text";
import CircularProgress from "@/components/CircularProgress";
import {
  PRIMARY,
  NEGATIVE,
  TEXT_TERTIARY,
  BACKGROUND_MAIN,
} from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

function SentimentBar() {
  return (
    <View style={styles.sentimentBarContainer}>
      <View style={styles.sentimentBarBg}>
        <View style={[styles.sentimentBarFill, { width: "60%" }]} />
      </View>
      <View style={styles.sentimentBarLabel}>
        <Text style={{ color: PRIMARY, fontSize: 15 }} weight="bold">
          12%
        </Text>
        <Text style={{ fontSize: 18, marginLeft: 6 }}>😊</Text>
      </View>
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
      <Animated.View style={[styles.animatedCard, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function Index() {
  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.welcome}>
        Welcome back!
      </Text>
      <Text weight="medium" style={styles.subtitle}>
        This Week
      </Text>
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CircularProgress percent={54} color={PRIMARY} label="Positive" />
          <View style={{ marginLeft: 18 }}>
            <Text style={styles.statPositive} weight="bold">
              63% <Text style={styles.statLabel}>Positive</Text>
            </Text>
            <Text style={styles.statNeutral} weight="bold">
              25% <Text style={styles.statLabel}>Neutral</Text>
            </Text>
            <Text style={styles.statNegative} weight="bold">
              12% <Text style={styles.statLabel}>Negative</Text>
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.segmentedRow}>
        <AnimatedCard>
          <Text>Two days ago</Text>
        </AnimatedCard>
        <AnimatedCard>
          <Text>Yesterday</Text>
        </AnimatedCard>
        <AnimatedCard>
          <Text>Today</Text>
        </AnimatedCard>
      </View>
      <SentimentBar />
      <Button
        title="Clear AsyncStorage"
        onPress={() => {
          AsyncStorage.clear();

          console.log("AsyncStorage cleared");
          alert("AsyncStorage cleared");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_MAIN,
    paddingTop: 64,
    paddingHorizontal: 18,
  },
  welcome: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 12,
    color: "#25283D",
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_TERTIARY,
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
  },
  statPositive: { color: PRIMARY, fontSize: 16, marginBottom: 2 },
  statNeutral: { color: TEXT_TERTIARY, fontSize: 16, marginBottom: 2 },
  statNegative: { color: NEGATIVE, fontSize: 16 },
  statLabel: { fontSize: 15 },
  segmentedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    marginTop: 2,
    gap: 10,
  },
  animatedCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  animatedCardActive: {
    backgroundColor: PRIMARY,
  },
  sentimentBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  sentimentBarBg: {
    flex: 1,
    height: 12,
    backgroundColor: "#ECECEC",
    borderRadius: 8,
    marginRight: 8,
    overflow: "hidden",
  },
  sentimentBarFill: {
    height: 12,
    backgroundColor: PRIMARY,
    borderRadius: 8,
  },
  sentimentBarLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
});

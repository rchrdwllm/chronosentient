import React, { useState } from "react";
import { View, StyleSheet, Animated, Pressable, TextInput } from "react-native";
import Text from "@/components/Text";
import { useRouter } from "expo-router";
import { ChevronLeft, Check } from "lucide-react-native";
import {
  BACKGROUND_MAIN,
  TEXT_SECONDARY,
  PRIMARY,
  TEXT_PRIMARY,
  TEXT_LIGHT,
  TEXT_TERTIARY,
  BACKGROUND_TRANSPARENT,
  SHADOW_COLOR,
} from "@/constants/colors";

function getTodayString() {
  const today = new Date();
  return today.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function AnimatedIconButton({ onPress, children, style }: any) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, style]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function AddScreen() {
  const router = useRouter();
  const [entry, setEntry] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_MAIN }}>
      <View style={styles.header}>
        <AnimatedIconButton
          onPress={() => router.back()}
          style={styles.headerIcon}
        >
          <ChevronLeft color={TEXT_SECONDARY} size={28} />
        </AnimatedIconButton>
        <Text weight="medium" style={styles.headerTitle}>
          {getTodayString()}
        </Text>
        <AnimatedIconButton style={styles.headerIcon}>
          <Check color={PRIMARY} size={26} />
        </AnimatedIconButton>
      </View>
      <Text weight="bold" style={styles.prompt}>
        Anong ganap mo today, fella?
      </Text>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Start writing your journal entry..."
        placeholderTextColor={TEXT_TERTIARY}
        value={entry}
        onChangeText={setEntry}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: BACKGROUND_MAIN,
  },
  headerIcon: {
    width: 32,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    color: TEXT_PRIMARY,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  prompt: {
    fontSize: 20,
    color: TEXT_LIGHT,
    textAlign: "center",
    marginTop: 80,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 20,
    fontSize: 16,
    lineHeight: 40,
    color: TEXT_SECONDARY,
    fontFamily: "Inter_400Regular",
    backgroundColor: BACKGROUND_TRANSPARENT,
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
});

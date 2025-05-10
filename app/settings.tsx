import { useState } from "react";
import { View, Switch, StyleSheet } from "react-native";
import Text from "@/components/Text";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [dataCollection, setDataCollection] = useState(false);
  const [notifications, setNotifications] = useState(false);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.header}>
        Settings
      </Text>

      <View style={styles.card}>
        <View style={styles.settingRow}>
          <Ionicons name="moon" size={20} color="#69A9F9" style={styles.icon} />
          <Text style={styles.label}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#ccc", true: "#69A9F9" }}
            thumbColor={darkMode ? "#ffffff" : "#f4f3f4"}
          />
        </View>
        <View style={styles.settingRow}>
          <MaterialCommunityIcons
            name="format-size"
            size={20}
            color="#69A9F9"
            style={styles.icon}
          />
          <Text style={styles.label}>Large Text</Text>
          <Switch
            value={largeText}
            onValueChange={setLargeText}
            trackColor={{ false: "#ccc", true: "#69A9F9" }}
            thumbColor={largeText ? "#ffffff" : "#f4f3f4"}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    backgroundColor: "#F7F7F7",
  },
  header: {
    fontSize: 28,
    marginBottom: 24,
    color: "#1C1C1E",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },
});

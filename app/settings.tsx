import { useState, useEffect } from "react";
import { View, Switch, StyleSheet } from "react-native";
import Text from "@/components/Text";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsScreen() {
  const { theme, toggleTheme, setIsUsingSystemTheme, isUsingSystemTheme, colors } = useTheme();
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const [useSystemTheme, setUseSystemTheme] = useState(isUsingSystemTheme);
  const [largeText, setLargeText] = useState(false);
  
  // Sync the darkMode state with the theme
  useEffect(() => {
    setDarkMode(theme === 'dark');
    setUseSystemTheme(isUsingSystemTheme);
  }, [theme, isUsingSystemTheme]);
  
  // Handle dark mode toggle
  const handleDarkModeToggle = (value: boolean) => {
    if (useSystemTheme) {
      // If using system theme, first disable system theme
      setUseSystemTheme(false);
      setIsUsingSystemTheme(false);
    }
    setDarkMode(value);
    toggleTheme();
  };
  
  // Handle system theme toggle
  const handleSystemThemeToggle = (value: boolean) => {
    setUseSystemTheme(value);
    setIsUsingSystemTheme(value);
    // If enabling system theme, update dark mode to match system
    if (value) {
      const systemColorScheme = theme; // This will be the system theme since we just enabled it
      setDarkMode(systemColorScheme === 'dark');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.main }]}>
      <Text weight="bold" style={[styles.header, { color: colors.text.primary }]}>
        Settings
      </Text>

      <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#2D2D35' : '#fff' }]}>
        <View style={styles.settingRow}>
          <Ionicons name="phone-portrait" size={20} color={colors.primary} style={styles.icon} />
          <Text style={[styles.label, { color: colors.text.primary }]}>Use System Theme</Text>
          <Switch
            value={useSystemTheme}
            onValueChange={handleSystemThemeToggle}
            trackColor={{ false: "#ccc", true: colors.primary }}
            thumbColor={useSystemTheme ? "#ffffff" : "#f4f3f4"}
          />
        </View>
        <View style={[styles.settingRow, { marginTop: 16, opacity: useSystemTheme ? 0.5 : 1 }]}>
          <Ionicons name="moon" size={20} color={colors.primary} style={styles.icon} />
          <Text style={[styles.label, { color: colors.text.primary }]}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: "#ccc", true: colors.primary }}
            thumbColor={darkMode ? "#ffffff" : "#f4f3f4"}
            disabled={useSystemTheme}
          />
        </View>
        <View style={[styles.settingRow, { marginTop: 16 }]}>
          <MaterialCommunityIcons
            name="format-size"
            size={20}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={[styles.label, { color: colors.text.primary }]}>Large Text</Text>
          <Switch
            value={largeText}
            onValueChange={setLargeText}
            trackColor={{ false: "#ccc", true: colors.primary }}
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
  },
  header: {
    fontSize: 28,
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    padding: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
});

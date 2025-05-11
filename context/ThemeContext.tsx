import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorSchemeName, useColorScheme, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';

// Import getColors directly to avoid circular dependencies
import { getColors } from '@/constants/colors';

// Define the shape of our theme context
type ThemeContextType = {
  theme: ColorSchemeName;
  colors: ReturnType<typeof getColors>;
  setThemePreference: (theme: ColorSchemeName | null) => void;
  toggleTheme: () => void;
  isUsingSystemTheme: boolean;
  setIsUsingSystemTheme: (value: boolean) => void;
  updateSystemBars: () => Promise<void>;
};

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: getColors('light'),
  setThemePreference: () => {},
  toggleTheme: () => {},
  isUsingSystemTheme: true,
  setIsUsingSystemTheme: () => {},
  updateSystemBars: async () => {},
});

// Theme preference keys for AsyncStorage
const THEME_PREFERENCE_KEY = '@theme_preference';
const USE_SYSTEM_THEME_KEY = '@use_system_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ColorSchemeName | null>(null);
  const [isUsingSystemTheme, setIsUsingSystemTheme] = useState(true);
  
  // Function to update system UI elements based on theme
  const updateSystemBars = async () => {
    const activeTheme = isUsingSystemTheme ? systemColorScheme : themePreference;
    const isDark = activeTheme === 'dark';
    const colors = getColors(activeTheme);
    
    // Set system UI background color
    await SystemUI.setBackgroundColorAsync(colors.background.main);
    
    // For Android, set navigation bar color and appearance
    if (Platform.OS === 'android') {
      await NavigationBar.setBackgroundColorAsync(colors.background.main);
      await NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
    }
  };

  // Load saved preferences from AsyncStorage on mount
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const [storedThemePreference, storedUseSystemTheme] = await Promise.all([
          AsyncStorage.getItem(THEME_PREFERENCE_KEY),
          AsyncStorage.getItem(USE_SYSTEM_THEME_KEY),
        ]);

        if (storedUseSystemTheme !== null) {
          setIsUsingSystemTheme(storedUseSystemTheme === 'true');
        }

        if (storedThemePreference !== null) {
          setThemePreference(storedThemePreference as ColorSchemeName);
        }
      } catch (error) {
        console.error('Failed to load theme preferences:', error);
      }
    };

    loadThemePreferences();
  }, []);

  // Save theme preferences whenever they change
  useEffect(() => {
    const saveThemePreferences = async () => {
      try {
        await AsyncStorage.setItem(USE_SYSTEM_THEME_KEY, String(isUsingSystemTheme));
        if (themePreference !== null) {
          await AsyncStorage.setItem(THEME_PREFERENCE_KEY, themePreference || 'light');
        }
      } catch (error) {
        console.error('Failed to save theme preferences:', error);
      }
    };

    saveThemePreferences();
  }, [themePreference, isUsingSystemTheme]);

  // Determine the active theme based on preferences
  const activeTheme = isUsingSystemTheme ? systemColorScheme : themePreference;
  const colors = getColors(activeTheme);

  // Update system bars when theme changes
  useEffect(() => {
    updateSystemBars();
  }, [activeTheme]);
  
  // Function to toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    setThemePreference(newTheme);
    setIsUsingSystemTheme(false);
  };

  // Function to set a specific theme preference
  const handleSetThemePreference = (theme: ColorSchemeName | null) => {
    setThemePreference(theme);
    if (theme === null) {
      setIsUsingSystemTheme(true);
    } else {
      setIsUsingSystemTheme(false);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        colors,
        setThemePreference: handleSetThemePreference,
        toggleTheme,
        isUsingSystemTheme,
        setIsUsingSystemTheme,
        updateSystemBars,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

/**
 * Hook to help with system bars (status bar, navigation bar) styling
 * @returns Object with StatusBar props and helper functions
 */
export const useSystemBars = () => {
  const { theme, colors, updateSystemBars } = useTheme();
  const isDark = theme === 'dark';
  
  return {
    statusBarProps: {
      backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.background.main,
      style: isDark ? 'light' as const : 'dark' as const,
      translucent: true,
    },
    updateSystemBars,
    isDark,
  };
};
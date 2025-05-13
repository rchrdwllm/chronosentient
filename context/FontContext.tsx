import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define scale factors for text sizes
const FONT_SCALE_NORMAL = 1.0;
const FONT_SCALE_LARGE = 1.5;

// Define the shape of our font context
type FontContextType = {
  isLargeTextEnabled: boolean;
  setIsLargeTextEnabled: (value: boolean) => void;
  fontScale: number;
};

// Create the context with a default value
const FontContext = createContext<FontContextType>({
  isLargeTextEnabled: false,
  setIsLargeTextEnabled: () => {},
  fontScale: FONT_SCALE_NORMAL,
});

// Font preference key for AsyncStorage
const LARGE_TEXT_PREFERENCE_KEY = "@large_text_preference";

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLargeTextEnabled, setIsLargeTextEnabled] = useState(false);

  // Load saved preferences from AsyncStorage on mount
  useEffect(() => {
    const loadFontPreferences = async () => {
      try {
        const storedLargeTextPreference = await AsyncStorage.getItem(
          LARGE_TEXT_PREFERENCE_KEY
        );
        if (storedLargeTextPreference !== null) {
          setIsLargeTextEnabled(storedLargeTextPreference === "true");
        }
      } catch (error) {
        console.error("Failed to load font preferences:", error);
      }
    };

    loadFontPreferences();
  }, []);

  // Save font preferences whenever they change
  useEffect(() => {
    const saveFontPreferences = async () => {
      try {
        await AsyncStorage.setItem(
          LARGE_TEXT_PREFERENCE_KEY,
          String(isLargeTextEnabled)
        );
      } catch (error) {
        console.error("Failed to save font preferences:", error);
      }
    };

    saveFontPreferences();
  }, [isLargeTextEnabled]);

  // Calculate the current font scale based on preferences
  const fontScale = isLargeTextEnabled ? FONT_SCALE_LARGE : FONT_SCALE_NORMAL;

  return (
    <FontContext.Provider
      value={{
        isLargeTextEnabled,
        setIsLargeTextEnabled,
        fontScale,
      }}
    >
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => useContext(FontContext);

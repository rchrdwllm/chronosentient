import { ColorSchemeName, useColorScheme } from "react-native";

/**
 * Color palette definition with light and dark mode variants
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Functional components with hooks:
 * ```
 * import { useColorScheme } from 'react-native';
 * import { getColors } from '../constants/colors';
 * 
 * function MyComponent() {
 *   const colorScheme = useColorScheme();
 *   const colors = getColors(colorScheme);
 *   
 *   return (
 *     <View style={{ backgroundColor: colors.background.main }}>
 *       <Text style={{ color: colors.text.primary }}>Hello World</Text>
 *     </View>
 *   );
 * }
 * ```
 * 
 * 2. With styled components:
 * ```
 * import styled from 'styled-components/native';
 * import { getColors } from '../constants/colors';
 * 
 * const StyledText = styled.Text`
 *   color: ${props => getColors(props.theme.colorScheme).text.primary};
 * `;
 * ```
 * 
 * 3. With React Context (recommended for app-wide theme):
 * ```
 * // ThemeContext.js
 * import React, { createContext, useContext } from 'react';
 * import { useColorScheme } from 'react-native';
 * import { getColors } from '../constants/colors';
 * 
 * const ThemeContext = createContext();
 * 
 * export const ThemeProvider = ({ children }) => {
 *   const colorScheme = useColorScheme();
 *   const colors = getColors(colorScheme);
 *   
 *   return (
 *     <ThemeContext.Provider value={{ colors, colorScheme }}>
 *       {children}
 *     </ThemeContext.Provider>
 *   );
 * };
 * 
 * export const useTheme = () => useContext(ThemeContext);
 * ```
 * 
 * Then in your components:
 * ```
 * import { useTheme } from '../context/ThemeContext';
 * 
 * function MyComponent() {
 *   const { colors } = useTheme();
 *   return <View style={{ backgroundColor: colors.background.main }} />;
 * }
 * ```
 */
const colorPalette = {
  // Primary colors
  primary: {
    light: "#71ABE0", // Blue color used for add button
    dark: "#4F8ACE",  // Darker blue for dark mode
  },

  // Text colors
  text: {
    primary: {
      light: "#25283D",
      dark: "#FFFFFF",
    },
    secondary: {
      light: "#797A86",
      dark: "#ADADB8",
    },
    tertiary: {
      light: "#C2C2C6",
      dark: "#707079",
    },
    light: {
      light: "#E1E1E2",
      dark: "#45454A",
    },
    white: {
      light: "#FFFFFF",
      dark: "#FFFFFF",
    },
  },

  // Background colors
  background: {
    main: {
      light: "#F6F6F4",
      dark: "#1A1A1F",
    },
    transparent: {
      light: "transparent",
      dark: "transparent",
    },
  },

  // Gradients
  gradients: {
    transparent: {
      light: "#F6F6F400",
      dark: "#1A1A1F00",
    },
  },

  // Negative sentiment color
  negative: {
    light: "#E05C71",
    dark: "#FF6B7E",
  },

  // Shadow color
  shadow: {
    light: undefined,
    dark: "#000000",
  },
};

/**
 * Function to get colors based on color scheme
 * @param colorScheme - 'light' or 'dark' color scheme
 * @returns Object containing all colors for the specified scheme
 */
export const getColors = (colorScheme: ColorSchemeName = "light") => {
  const mode = colorScheme === "dark" ? "dark" : "light";

  return {
    // Primary colors
    primary: colorPalette.primary[mode],

    // Text colors
    text: {
      primary: colorPalette.text.primary[mode],
      secondary: colorPalette.text.secondary[mode],
      tertiary: colorPalette.text.tertiary[mode],
      light: colorPalette.text.light[mode],
      white: colorPalette.text.white[mode],
    },

    // Background colors
    background: {
      main: colorPalette.background.main[mode],
      transparent: colorPalette.background.transparent[mode],
    },

    // Gradients
    gradients: {
      transparent: colorPalette.gradients.transparent[mode],
    },

    // Other
    shadow: colorPalette.shadow[mode],
    negative: colorPalette.negative[mode],
  };
};

/**
 * Helper hook to get colors based on the current theme context or system theme
 * @returns Colors object for the current theme
 */
export const useThemeColors = () => {
  try {
    // Try to import the ThemeContext
    // This needs to be done conditionally to avoid circular dependencies
    const { useTheme } = require('@/context/ThemeContext');
    const { colors } = useTheme();
    return colors;
  } catch (e) {
    // Fallback to system theme if ThemeContext is not available
    const colorScheme = useColorScheme();
    return getColors(colorScheme);
  }
};

// Default colors (light mode) for backward compatibility
const defaultColors = getColors("light");

// Export colors object for backward compatibility
export const colors = defaultColors;

// Export individual colors for easier imports
export const PRIMARY = colors.primary;

// Text colors
export const TEXT_PRIMARY = colors.text.primary;
export const TEXT_SECONDARY = colors.text.secondary;
export const TEXT_TERTIARY = colors.text.tertiary;
export const TEXT_LIGHT = colors.text.light;
export const TEXT_WHITE = colors.text.white;

// Background colors
export const BACKGROUND_MAIN = colors.background.main;
export const BACKGROUND_TRANSPARENT = colors.background.transparent;

// Gradients
export const GRADIENT_TRANSPARENT = colors.gradients.transparent;

// Other
export const SHADOW_COLOR = colors.shadow;

// Negative sentiment color
export const NEGATIVE = colors.negative;
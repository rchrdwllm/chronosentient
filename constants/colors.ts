// All application colors centralized in one place
export const colors = {
  // Primary colors
  primary: "#71ABE0", // Blue color used for add button

  // Text colors
  text: {
    primary: "#25283D",
    secondary: "#797A86",
    tertiary: "#C2C2C6",
    light: "#E1E1E2",
    white: "#FFFFFF",
  },

  // Background colors
  background: {
    main: "#F6F6F4",
    transparent: "transparent",
  },

  // Gradients
  gradients: {
    transparent: "#F6F6F400",
  },

  // Other
  shadow: undefined,
};

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

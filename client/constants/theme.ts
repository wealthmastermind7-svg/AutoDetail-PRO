import { Platform } from "react-native";

export const Colors = {
  light: {
    pureBlack: "#000000",
    charcoal: "#1A1A1A",
    graphite: "#2D2D2D",
    slate: "#4A4A4A",
    smoke: "#6B6B6B",
    silver: "#9E9E9E",
    fog: "#D4D4D4",
    whisper: "#EBEBEB",
    pearl: "#F5F5F5",
    pureWhite: "#FFFFFF",
    text: "#000000",
    textSecondary: "#6B6B6B",
    textTertiary: "#9E9E9E",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9E9E9E",
    tabIconSelected: "#000000",
    link: "#000000",
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F5F5F5",
    backgroundSecondary: "#EBEBEB",
    backgroundTertiary: "#D4D4D4",
    border: "#4A4A4A",
    borderLight: "#EBEBEB",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    accent: "#000000",
  },
  dark: {
    pureBlack: "#000000",
    charcoal: "#1A1A1A",
    graphite: "#2D2D2D",
    slate: "#4A4A4A",
    smoke: "#6B6B6B",
    silver: "#9E9E9E",
    fog: "#D4D4D4",
    whisper: "#EBEBEB",
    pearl: "#F5F5F5",
    pureWhite: "#FFFFFF",
    text: "#FFFFFF",
    textSecondary: "#9E9E9E",
    textTertiary: "#6B6B6B",
    buttonText: "#000000",
    tabIconDefault: "#6B6B6B",
    tabIconSelected: "#FFFFFF",
    link: "#FFFFFF",
    backgroundRoot: "#000000",
    backgroundDefault: "#1A1A1A",
    backgroundSecondary: "#2D2D2D",
    backgroundTertiary: "#4A4A4A",
    border: "#4A4A4A",
    borderLight: "#2D2D2D",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    accent: "#FFFFFF",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 56,
  buttonHeight: 56,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 72,
    fontWeight: "200" as const,
  },
  displaySmall: {
    fontSize: 56,
    fontWeight: "200" as const,
  },
  h1: {
    fontSize: 48,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 32,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  bodyLarge: {
    fontSize: 24,
    fontWeight: "400" as const,
  },
  body: {
    fontSize: 18,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 18,
    fontWeight: "400" as const,
  },
};

export const Animation = {
  fast: 150,
  normal: 200,
  slow: 300,
  cinematic: 400,
  graph: 600,
  spring: {
    damping: 15,
    mass: 0.3,
    stiffness: 150,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

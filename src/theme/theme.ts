/**
 * AIP Genius Design System — Theme
 *
 * Derived from the AIP Genius web app:
 *   - Brand accent: #346590
 *   - Font: Source Sans 3
 *   - Dark sidebar: #1B2A3D
 */

export const colors = {
  /** Brand */
  primary: "#346590",
  primaryLight: "#4A80A8",
  primaryDark: "#264A6B",

  /** Sidebar / drawer */
  sidebar: "#1B2A3D",
  sidebarText: "#FFFFFF",
  sidebarTextMuted: "#94A3B8",
  sidebarHover: "#253A52",
  sidebarActive: "#346590",

  /** Backgrounds */
  background: "#F5F7FA",
  surface: "#FFFFFF",
  surfaceBorder: "#E2E8F0",

  /** Text */
  textPrimary: "#1A202C",
  textSecondary: "#4A5568",
  textMuted: "#94A3B8",
  textOnPrimary: "#FFFFFF",
  textOnDark: "#FFFFFF",

  /** Chat bubbles */
  userBubble: "#346590",
  userBubbleText: "#FFFFFF",
  botBubble: "#F0F4F8",
  botBubbleText: "#1A202C",

  /** Feedback & status */
  success: "#38A169",
  warning: "#D69E2E",
  error: "#E53E3E",
  info: "#346590",

  /** Misc */
  divider: "#E2E8F0",
  inputBorder: "#CBD5E0",
  inputBackground: "#FFFFFF",
  placeholder: "#A0AEC0",
  overlay: "rgba(0, 0, 0, 0.5)",
} as const;

export const typography = {
  fontFamily: {
    regular: "SourceSans3-Regular",
    medium: "SourceSans3-Medium",
    semiBold: "SourceSans3-SemiBold",
    bold: "SourceSans3-Bold",
    /** Fallback while fonts load */
    system: "System",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    heading: 28,
    hero: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  screenPadding: 16,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

const theme = { colors, typography, spacing, borderRadius, shadows } as const;
export type Theme = typeof theme;
export default theme;

import { colors, typography, spacing, borderRadius } from "../src/theme";

describe("theme", () => {
  it("has all required color tokens", () => {
    expect(colors.primary).toBe("#346590");
    expect(colors.sidebar).toBe("#1B2A3D");
    expect(colors.background).toBeDefined();
    expect(colors.surface).toBeDefined();
    expect(colors.userBubble).toBeDefined();
    expect(colors.botBubble).toBeDefined();
  });

  it("has font size scale", () => {
    expect(typography.fontSize.sm).toBeLessThan(typography.fontSize.md);
    expect(typography.fontSize.md).toBeLessThan(typography.fontSize.lg);
    expect(typography.fontSize.lg).toBeLessThan(typography.fontSize.xl);
  });

  it("has spacing scale", () => {
    expect(spacing.xs).toBeLessThan(spacing.sm);
    expect(spacing.sm).toBeLessThan(spacing.md);
    expect(spacing.md).toBeLessThan(spacing.lg);
  });

  it("has border radius values", () => {
    expect(borderRadius.full).toBe(9999);
    expect(borderRadius.sm).toBeLessThan(borderRadius.lg);
  });
});

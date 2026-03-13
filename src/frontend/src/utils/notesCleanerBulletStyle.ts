// Internal bullet style configuration for Notes Cleaner
// Currently locked to "dash" style for Module 01
// Future expandable to: "dot", "number", "arrow"

type BulletStyle = "dash" | "dot" | "number" | "arrow";

// Locked to dash for Module 01
const CURRENT_BULLET_STYLE: BulletStyle = "dash";

/**
 * Returns the bullet prefix for the active bullet style
 * Currently locked to dash ("- ") for Module 01
 */
export function getBulletPrefix(
  style: BulletStyle = CURRENT_BULLET_STYLE,
): string {
  switch (style) {
    case "dash":
      return "- ";
    case "dot":
      return "• ";
    case "number":
      // Number bullets would need index parameter in future
      return "1. ";
    case "arrow":
      return "→ ";
    default:
      return "- ";
  }
}

/**
 * Returns the current locked bullet style
 */
export function getCurrentBulletStyle(): BulletStyle {
  return CURRENT_BULLET_STYLE;
}

import { Platform } from "react-native";

export const getWebOS = async () => {
  if (Platform.OS !== "web") return null;

  // Modern API — Chromium-based browsers only
  if (navigator.userAgentData) {
    const hints = await navigator.userAgentData.getHighEntropyValues([
      "platform",
    ]);
    return hints.platform.toLowerCase(); // 'android', 'windows', 'macos', 'linux', etc.
  }

  // Fallback to UA string
  return parseUserAgent(navigator.userAgent);
};

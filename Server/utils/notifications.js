import { Expo } from "expo-server-sdk";
let expo = new Expo();

export async function sendPushNotification(pushTokens, title, body) {
  // Handle both single token and array of tokens
  const tokensArray = Array.isArray(pushTokens) ? pushTokens : [pushTokens];
  
  // Filter out invalid tokens
  const validTokens = tokensArray.filter(token => Expo.isExpoPushToken(token));
  
  if (validTokens.length === 0) {
    // console.log("No valid Expo push tokens found");
    return;
  }

  // Create messages for all valid tokens
  const messages = validTokens.map(token => ({
    to: token,
    sound: "default",
    title,
    body,
    channelId: "default",
    data: { withSome: "data" },
  }));

  const chunks = expo.chunkPushNotifications(messages);

  for (let chunk of chunks) {
    try {
      let result = await expo.sendPushNotificationsAsync(chunk);
      // console.log("Expo result", result);
    } catch (error) {
      console.error("Push notification error:", error);
    }
  }
}
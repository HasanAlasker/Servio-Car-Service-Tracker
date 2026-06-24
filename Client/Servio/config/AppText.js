import { StyleSheet, Text, Platform } from "react-native";

function AppText({ children, size, style, ...otherProps }) {
  return (
    <Text style={[{ fontSize: size }, styles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.select({
      android: "Roboto",
      ios: undefined, // uses San Francisco automatically
      web: "Roboto, sans-serif",
    }),
    letterSpacing: -0.5,
  },
});

export default AppText;

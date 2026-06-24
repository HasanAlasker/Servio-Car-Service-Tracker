import { View, StyleSheet } from "react-native";

function GapContainer({ children, gap, style, flex, fullHeight }) {
  return (
    <View
      style={[
        styles.container,
        style,
        { gap: gap ? gap : 25, flex: flex ? 1 : "none" },
        { height: fullHeight ? "100%" : "auto" },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    flex: 1,
  },
});

export default GapContainer;

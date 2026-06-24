import { View, StyleSheet } from "react-native";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";

function VerticalLine({ color = "faded", full, style }) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme[color] }]}></View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      height: "100%",
      width: 1.8,
    },
  });

export default VerticalLine;

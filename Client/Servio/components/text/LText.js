import { StyleSheet } from "react-native";
import AppText from "../../config/AppText";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";

function LText({ children, color, style }) {
  const { theme } = useTheme();
  const styles = useThemedStyles(getStyles);
  return (
    <AppText
      style={[styles.text, { color: theme[color] || theme["main_text"] }, style]}
    >
      {children}
    </AppText>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    text: {
      fontSize: 30,
      fontWeight: "bold",
      color: theme.main_text,
    },
  });

export default LText;

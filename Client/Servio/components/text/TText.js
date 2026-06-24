import { StyleSheet } from "react-native";
import AppText from "../../config/AppText";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";

function TText({ children, color, thin, style, ...other }) {
  const { theme } = useTheme();
  const styles = useThemedStyles(getStyles);
  return (
    <AppText
      style={[
        styles.text,
        { color: theme[color] || theme["main_text"] },
        { fontWeight: thin || "bold" },
        style,
      ]}
      {...other}
    >
      {children}
    </AppText>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    text: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.main_text,
    },
  });

export default TText;

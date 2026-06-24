import { StyleSheet, Pressable } from "react-native";
import AppText from "../../config/AppText";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";

function PriBtn({
  title,
  onPress,
  disabled,
  full,
  style,
  square,
  black = false,
  red = false,
  half,
  auto,
  styleText,
}) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.container,
        disabled && styles.disabled,
        style,
        {
          width: full ? "100%" : half ? "50%" : auto ? "auto " : "90%",
          borderRadius: square ? 15 : 25,
        },
        {
          backgroundColor: black
            ? theme.main_text
            : red
              ? theme.red
              : theme.blue,
          borderColor: black ? theme.main_text : red ? theme.red : theme.blue,
        },
      ]}
    >
      <AppText
        style={[
          styles.text,
          { color: black ? theme.white : theme.always_white },
          styleText,
        ]}
      >
        {title || "Press"}
      </AppText>
    </Pressable>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: "auto",
      backgroundColor: theme.blue,
      padding: 9,
      borderRadius: 25,
      borderColor: theme.blue,
      borderWidth: 1,
    },
    text: {
      color: theme.always_white,
      fontWeight: "bold",
      fontSize: 18,
      textAlign: "center",
    },
    disabled: {
      opacity: 0.5,
    },
  });

export default PriBtn;

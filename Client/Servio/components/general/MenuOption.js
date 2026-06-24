import { StyleSheet, Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import useThemedStyles from "../../hooks/useThemedStyles";
import SText from "../text/SText";

function MenuOption({ text, icon, color, onPress, disabled, showLock, style }) {
  const { theme } = useTheme();
  const styles = useThemedStyles(getStyles);

  return (
    <Pressable
      style={[styles.container, disabled && styles.disabledContainer, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <SText
        thin
        color={color ? color : "main_text"}
        style={disabled && styles.disabledText}
      >
        {text}
      </SText>
      <View style={styles.iconContainer}>
        {showLock && <Feather name="lock" size={20} color={theme.sec_text} />}
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={color ? theme[color] : theme["main_text"]}
          />
        )}
      </View>
    </Pressable>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    disabledContainer: {
      opacity: 0.4,
    },
    disabledText: {
      color: theme.sec_text,
    },
    iconContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });

export default MenuOption;

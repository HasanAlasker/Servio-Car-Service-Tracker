import { Feather } from "@expo/vector-icons";
import { StyleSheet, Pressable } from "react-native";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";

function MenuBackBtn({ onClose, x, style, ninty }) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();

  return (
    <Pressable onPress={onClose} style={[styles.container, style]}>
      {x ? (
        <Feather name="x" size={35} color={theme.blue}></Feather>
      ) : (
        <Feather name="arrow-left" size={35} color={theme.blue}></Feather>
      )}
    </Pressable>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginBottom: 25,
      alignSelf: "flex-start",
    },
  });

export default MenuBackBtn;

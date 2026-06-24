import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Pressable } from "react-native";
import SText from "../text/SText";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";

function SquareHome({ title, icon, color, onPress }) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();

  const backColor = theme[color] + "15";

  return (
    <Pressable
      style={[
        styles.container,
        { backgroundColor: backColor, borderColor: theme[color] },
      ]}
      onPress={onPress}
    >
      <MaterialCommunityIcons name={icon} color={theme[color]} size={40} />
      <SText color={color}>{title}</SText>
    </Pressable>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      aspectRatio: 1,
      width: "28%",
      borderRadius: 18,
      justifyContent: "center",
      borderWidth: 2,
    },
  });

export default SquareHome;

import { View, StyleSheet } from "react-native";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function SquareIcon({ icon }) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();

  return (
    <View style={[styles.container]}>
      <MaterialCommunityIcons name={icon} color={theme.main_text} size={30} />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      aspectRatio: 1,
      borderRadius: 10,
      justifyContent: "center",
      borderWidth: 1,
      padding: 4,
      backgroundColor: theme.light_gray + "50",
      borderColor: theme.faded,
    },
  });

export default SquareIcon;

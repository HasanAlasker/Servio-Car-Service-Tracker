import { StyleSheet, Pressable } from "react-native";
import AppText from "../../config/AppText";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  LinearTransition,
  PinwheelOut,
  RotateInDownLeft,
  SlideInDown,
  SlideInUp,
  ZoomOut,
} from "react-native-reanimated";
import { DrawerActions } from "@react-navigation/native";

function GhostBtn({
  title,
  onPress,
  disabled,
  full,
  style,
  black = false,
  red = false,
  half,
  auto,
  styleText,
  icon,
}) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();

  let color = red ? theme.red : black ? theme.main_text : theme.blue;
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeInUp}
      style={{ marginHorizontal: "auto" }}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.container,
          disabled && styles.disabled,
          style,
          {
            width: full ? "100%" : half ? "50%" : auto ? "auto " : "90%",
          },
        ]}
      >
        {title && (
          <AppText style={[styles.text, { color }, styleText]}>
            {title || "Press"}
          </AppText>
        )}
        {!title && <Feather name={icon} size={20} color={color} />}
      </Pressable>
    </Animated.View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      width: "90%",
      marginHorizontal: "auto",
      backgroundColor: theme.bacground,
      borderRadius: 25,
      paddingVertical: 5,
      paddingHorizontal: 20,
    },
    text: {
      color: theme.blue,
      fontWeight: "bold",
      fontSize: 18,
      textAlign: "center",
    },
  });

export default GhostBtn;

import { View, StyleSheet, Pressable } from "react-native";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";
import Animated, { BounceIn, LinearTransition } from "react-native-reanimated";

function MiniRedCircle() {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();

  return (
    <Animated.View
      layout={LinearTransition}
      entering={BounceIn}
      style={styles.container}
    ></Animated.View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.blue,
      width: 14,
      height: 14,
      borderRadius: "50%",
      justifyContent: "center",
      alignItems: "center",
      borderColor: theme.post,
      borderWidth: 2.5,
      position: "absolute",
      bottom: 32,
      left: 29,
      zIndex: 10,
    },
  });

export default MiniRedCircle;

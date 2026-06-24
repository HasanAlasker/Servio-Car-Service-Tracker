import { View, StyleSheet } from "react-native";
import useThemedStyles from "../../hooks/useThemedStyles";
import AppText from "../../config/AppText";
import { useTheme } from "../../context/ThemeContext";
import Animated, { BounceIn, LinearTransition } from "react-native-reanimated";

function RedCircle({ numOfNotifications }) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();

  return (
    <Animated.View
      layout={LinearTransition}
      entering={BounceIn}
      style={styles.container}
    >
      <AppText
        style={{
          color: theme.always_white,
          fontWeight: "bold",
          textAlign: "center",
        }}
        size={10}
      >
        {numOfNotifications}
      </AppText>
    </Animated.View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.red,
      Width: 17,
      height: 17,
      aspectRatio: 1 / 1,
      borderRadius: "50%",
      justifyContent: "center",
      alignItems: "center",
      borderColor: theme.background,
      borderWidth: 1.5,
      position: "absolute",
      zIndex: 100,
      right: 0,
      top: -1,
    },
  });

export default RedCircle;

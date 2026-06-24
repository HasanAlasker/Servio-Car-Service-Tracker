import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import useThemedStyles from "../../hooks/useThemedStyles";

function Shade() {
  const styles = useThemedStyles(getStyles);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 22, stiffness: 180 });
    opacity.value = withTiming(1, { duration: 150 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.shade, animatedStyle]} />;
}

const getStyles = (theme) =>
  StyleSheet.create({
    shade: {
      backgroundColor: theme.shade,
      width: 47,
      height: 30,
      borderRadius: 25,
      position: "absolute",
      alignSelf: "center",
      top: 0,
      zIndex: 0,
    },
  });

export default Shade;
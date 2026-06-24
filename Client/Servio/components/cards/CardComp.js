import { StyleSheet, Pressable } from "react-native";
import useThemedStyles from "../../hooks/useThemedStyles";
import Animated, {
  FadeIn,
  LightSpeedInLeft,
  LinearTransition,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";

function CardComp({ children, style, onPress, short, animate = true, slideIn = true }) {
  const styles = useThemedStyles(getStyles);
  return (
    <Animated.View
      layout={animate && LinearTransition}
      entering={slideIn && SlideInDown}
    >
      <Pressable
        style={[styles.container, style, { width: short ? "90%" : "100%" }]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.post,
      paddingHorizontal: 22,
      paddingVertical: 25,
      borderRadius: 15,
      marginHorizontal: "auto",
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.14)",

      // shadowColor: "#000",
      // shadowOffset: {
      //   width: 0,
      //   height: 1,
      // },
      // shadowOpacity: 0.22,
      // shadowRadius: 2.22,

      // elevation: 2,
    },
  });

export default CardComp;

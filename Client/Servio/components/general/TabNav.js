import React, { useEffect } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import SText from "../text/SText";
import RowCont from "./RowCont";
import { useTheme } from "../../context/ThemeContext";
import useThemedStyles from "../../hooks/useThemedStyles";

const AnimatedSText = Animated.createAnimatedComponent(SText);

function TabNav({ active, onTabChange, one, two }) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();

  const transition = useSharedValue(active === "1" ? 0 : 1);

  useEffect(() => {
    transition.value = withSpring(active === "1" ? 0 : 1, {
      damping: 18,
      stiffness: 150,
      mass: 0.6,
    });
  }, [active]);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${transition.value * 100}%` }],
  }));

  const getTextStyle = (tabKey) =>
    useAnimatedStyle(() => ({
      color: interpolateColor(
        transition.value,
        [0, 1],
        [
          tabKey === "1" ? theme.always_white : theme.sec_text,
          tabKey === "1" ? theme.sec_text : theme.always_white,
        ]
      ),
    }));

  return (
    <RowCont gap={"none"} style={[styles.container, { marginBottom: 40 }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[styles.activePill, animatedPillStyle]} />
      </View>

      <Pressable onPress={() => onTabChange("1")} style={styles.btn}>
        <AnimatedSText
          style={[styles.text, getTextStyle("1")]}
          thin={active === "2"}
        >
          {one}
        </AnimatedSText>
      </Pressable>

      <Pressable onPress={() => onTabChange("2")} style={styles.btn}>
        <AnimatedSText
          style={[styles.text, getTextStyle("2")]}
          thin={active === "1"}
        >
          {two}
        </AnimatedSText>
      </Pressable>
    </RowCont>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.faded,
      borderRadius: 22,
      padding: 2,
      alignItems: "center",
    },
    btn: {
      width: "50%",
      paddingVertical: 8,
      borderRadius: 20,
      zIndex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    activePill: {
      width: "50%",
      height: "100%",
      backgroundColor: theme.blue,
      borderColor:theme.faded,
      borderWidth:1.5,
      borderRadius: 22,
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.14)",

    },
    text: {
      textAlign: "center",
    },
  });

export default TabNav;
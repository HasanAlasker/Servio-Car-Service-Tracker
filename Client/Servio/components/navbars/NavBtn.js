import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, Pressable, Text } from "react-native";
import useThemedStyles from "../../hooks/useThemedStyles";
import Shade from "./Shade";
import MiniRedCircle from "../general/MiniRedCircle";
import { useTheme } from "../../context/ThemeContext";
import { cloneElement } from "react";

function NavBtn({
  name,
  icon,
  lable,
  onPress,
  notificationCondition,
  textStyle,
  isSettings,
  activeIn,
}) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const isActive =
    route.name === name || (activeIn && activeIn.includes(route.name));

  const iconWithStyle = icon
    ? cloneElement(icon, {
        style: [styles.icon, { color: isActive ? theme.blue : theme.sec_text }],
      })
    : null;

  return (
    <Pressable
      style={styles.navbarBtn}
      onPress={() => {
        if (!isSettings) navigation.navigate(name);
        onPress?.();
      }}
    >
      {iconWithStyle}
      <Text style={[styles.text, textStyle, isActive && styles.active]}>
        {lable ? lable : name}
      </Text>

      {notificationCondition && !isActive && <MiniRedCircle />}
      {isActive && <Shade />}
    </Pressable>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    navbarBtn: {
      display: "flex",
      textAlign: "center",
      justifyContent: "space-between",
    },
    icon: {
      textAlign: "center",
      color: theme.sec_text,
      zIndex: 1,
    },
    text: {
      color: theme.sec_text,
      fontSize: 12,
      textAlign: "center",
      zIndex: 1,
    },
    active: {
      color: theme.blue,
    },
  });

export default NavBtn;

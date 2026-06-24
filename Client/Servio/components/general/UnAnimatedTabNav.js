import { StyleSheet, Pressable } from "react-native";
import SText from "../text/SText";
import RowCont from "./RowCont";
import { useTheme } from "../../context/ThemeContext";
import useThemedStyles from "../../hooks/useThemedStyles";

function UnAnimatedTabNav({ active, onTabChange, one, two }) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();

  return (
    <RowCont gap={"none"} style={[styles.container, { marginBottom: 40 }]}>
      <Pressable
        onPress={onTabChange}
        style={[
          styles.btn,
          {
            backgroundColor: active === "1" ? theme.blue : theme.faded,
          },
        ]}
      >
        <SText
          style={[
            styles.text,
            { color: active === "1" ? theme.always_white : theme.sec_text },
          ]}
          thin={active === "2"}
        >
          {one}
        </SText>
      </Pressable>

      <Pressable
        onPress={onTabChange}
        style={[
          styles.btn,
          {
            backgroundColor: active === "2" ? theme.blue : theme.faded,
          },
        ]}
      >
        <SText
          style={[
            styles.text,
            { color: active === "2" ? theme.always_white : theme.sec_text },
          ]}
          thin={active === "1"}
        >
          {two}
        </SText>
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
      backgroundColor: theme.blue,
      borderRadius: 20,
    },
    text: {
      textAlign: "center",
    },
    active: {},
  });

export default UnAnimatedTabNav;

import { StyleSheet, Pressable } from "react-native";
import TText from "../text/TText";
import useThemedStyles from "../../hooks/useThemedStyles";

function PressText({ onPress }) {
  const styles = useThemedStyles(getStyles);
  return (
    <Pressable onPress={onPress} style={styles.press}>
      <TText color={"blue"}>Need a month calculator?</TText>
    </Pressable>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    press: {
      width: "90%",
      marginHorizontal: "auto",
    },
  });

export default PressText;

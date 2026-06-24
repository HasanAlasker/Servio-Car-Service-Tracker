import { View, StyleSheet } from "react-native";
import TText from "../text/TText";
import { capFirstLetter } from "../../functions/CapFirstLetterOfWord";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";
import Animated, { BounceInUp, LinearTransition } from "react-native-reanimated";

function StatusLabel({ status, style, lable }) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();

  let color = "";

  switch (status) {
    case "pending":
      color = "gold";
      break;
      
    case "Selected":
      color = "blue";
      break;

    case "confirmed":
    case false:
      color = "green";
      break;

    case "rejected":
    case "no-show":
    case "canceled":
    case true:
      color = "red";
      break;



    default:
      color = "lightBlue";
  }

  let backColor = theme[color] + 15;

  return (
    <Animated.View
    layout={LinearTransition}
      style={[
        styles.container,
        { backgroundColor: theme[color], borderColor: theme[color] },
        style,
      ]}
    >
      <TText style={{ color: theme.always_white }}>
        {capFirstLetter(lable ?? status ?? "...")}
      </TText>
    </Animated.View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      borderRadius: 15,
      paddingVertical: 2,
      paddingHorizontal: 10,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-start",
    },
  });

export default StatusLabel;

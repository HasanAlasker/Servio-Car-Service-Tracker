import { StyleSheet, Pressable } from "react-native";
import RowCont from "./RowCont";
import { Feather } from "@expo/vector-icons";
import SText from "../text/SText";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

function Pill({ icon, text, navigateTo, params, onPress }) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();
  const navigate = useNavigation();

  const handlePress = () => {
    if (onPress) onPress();
    if (navigateTo) navigate.navigate(navigateTo, params);
  };

  return (
    <Pressable onPress={handlePress}>
      <RowCont style={styles.container}>
        <Feather color={theme.main_text} size={20} name={icon} />
        <SText thin>{text}</SText>
      </RowCont>
    </Pressable>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.post,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",

      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.14)",

    },
  });

export default Pill;

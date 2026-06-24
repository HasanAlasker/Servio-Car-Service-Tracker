import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SText from "../text/SText";
import RowCont from "./RowCont";

function IconTextLabel({ icon, text }) {
  const { theme } = useTheme();

  return (
    <RowCont gap={5} style={styles.container}>
      <MaterialCommunityIcons name={icon} size={28} color={theme.main_text} />
      <SText>{text}</SText>
    </RowCont>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default IconTextLabel;

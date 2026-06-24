import { StyleSheet, Pressable } from "react-native";
import RowCont from "./RowCont";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import SText from "../text/SText";

function SettingsOption({ icon, text, onPress, red }) {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <RowCont
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <RowCont gap={15}>
          <Feather
            name={icon}
            size={22}
            color={red ? theme.red : theme.main_text}
          />
          <SText thin color={red ? "red" : "main_text"}>
            {text}
          </SText>
        </RowCont>
        <Feather name={"chevron-right"} size={20} color={red ? theme.red : theme.main_text} />
      </RowCont>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SettingsOption;

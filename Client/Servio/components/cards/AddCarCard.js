import { StyleSheet } from "react-native";
import CardComp from "./CardComp";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import MText from "../../components/text/MText";
import { useNavigation } from "@react-navigation/native";

function AddCarCard({ text, icon, navigateTo, color, params, onPress }) {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <CardComp
      style={styles.container}
      onPress={
        onPress ? onPress : () => navigation.navigate(navigateTo, params)
      }
    >
      <MaterialCommunityIcons name={icon} color={theme[color]} size={35} />
      <MText color={color}>{text}</MText>
    </CardComp>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
});

export default AddCarCard;

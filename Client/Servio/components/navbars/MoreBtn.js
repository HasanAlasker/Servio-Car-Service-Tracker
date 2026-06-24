import { useNavigation } from "@react-navigation/native";
import NavBtn from "./NavBtn";
import { Feather } from "@expo/vector-icons";

function MoreBtn() {
  const navigate = useNavigation();
  return (
    <NavBtn
      name="More"
      icon={<Feather name="more-horizontal" size={26} />}
      isSettings
      onPress={() => navigate.navigate("Settings")}
    />
  );
}

export default MoreBtn;

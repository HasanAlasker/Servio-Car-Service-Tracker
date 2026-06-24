import { View, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import LogoAndMoto from "../../components/welcome/LogoAndMoto";
import PriBtn from "../../components/general/PriBtn";
import SecBtn from "../../components/general/SecBtn";
import GapContainer from "../../components/general/GapContainer";
import { useNavigation } from "@react-navigation/native";
import OfflineModal from "../../components/general/OfflineModal";
import ScrollScreen from "../../components/general/ScrollScreen";

function Welcome(props) {
  const navigation = useNavigation();

  return (
    <SafeScreen gradient>
      <ScrollScreen containerStyle={styles.container}>
        <LogoAndMoto moto />
        <GapContainer gap={15}>
          <PriBtn
            square
            full
            title={"Login"}
            onPress={() => navigation.navigate("Login")}
          />
          <SecBtn
            square
            full
            title={"Register"}
            onPress={() => navigation.navigate("Register")}
          />
        </GapContainer>
      </ScrollScreen>

      <OfflineModal />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: "auto",
    gap: 60,
    paddingBottom: 60,
  },
});

export default Welcome;

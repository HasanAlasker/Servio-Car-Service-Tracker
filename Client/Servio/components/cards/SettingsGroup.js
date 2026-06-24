import { StyleSheet } from "react-native";
import CardComp from "./CardComp";
import GapContainer from "../general/GapContainer";
import TText from "../text/TText";

function SettingsGroup({ label, children }) {
  return (
    <GapContainer gap={8}>
      <TText thin color={"sec_text"}>
        {label}
      </TText>
      <CardComp style={styles.container}>{children}</CardComp>
    </GapContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 15,
    gap: 8,

    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.14)",
  },
});

export default SettingsGroup;

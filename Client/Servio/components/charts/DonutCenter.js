import { View, StyleSheet } from "react-native";
import SText from "../text/SText";

function DonutCenter({ total }) {
  return (
    <View style={styles.donutCenter}>
      <SText thin color={"sec_text"} style={{ fontSize: 11 }}>
        Total
      </SText>
      <SText style={{ fontSize: 20, fontWeight: "700" }}>{total}</SText>
    </View>
  );
}

const styles = StyleSheet.create({
  donutCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DonutCenter;

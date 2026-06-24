import { View, StyleSheet } from "react-native";

function LegendCont({ children }) {
  return <View style={styles.legend}>{children}</View>;
}

const styles = StyleSheet.create({
  legend: {
    flex: 1,
    gap: 10,
  },
});

export default LegendCont;

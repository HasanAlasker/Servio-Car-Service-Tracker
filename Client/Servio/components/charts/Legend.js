import { View, StyleSheet } from "react-native";
import SText from "../text/SText";

function Legend({ color, label, value }) {
  const total = value;

  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <SText thin color={"sec_text"} style={styles.legendLabel}>
        {label}
      </SText>
      <SText style={styles.legendValue}>{value ?? "—"}</SText>
    </View>
  );
}

const styles = StyleSheet.create({
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
  },
  legendValue: {
    fontSize: 13,
  },
});

export default Legend;

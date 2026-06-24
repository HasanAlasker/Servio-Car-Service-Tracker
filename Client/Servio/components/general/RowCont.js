import { View, StyleSheet } from "react-native";

function RowCont({ children, gap, style, spaceBetween }) {
  return (
    <View
      style={[
        styles.container,
        { gap: gap || 6 },
        spaceBetween && styles.space,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  space: {
    justifyContent: "space-between",
  },
});

export default RowCont;

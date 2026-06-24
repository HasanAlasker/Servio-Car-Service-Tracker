import { View, StyleSheet } from "react-native";

function InputCont({ children, full }) {
  return (
    <View style={[styles.container, { width: full ? "100%" : "90%" }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: "auto", gap: 5 },
});

export default InputCont;

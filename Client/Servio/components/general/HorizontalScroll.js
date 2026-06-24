import { StyleSheet, ScrollView } from "react-native";

function HorizontalScroll({ children }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.cont}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cont: {
    paddingBottom:2,
  },
});

export default HorizontalScroll;

import { View, StyleSheet } from "react-native";
import useThemedStyles from "../../hooks/useThemedStyles";

function NavCont({ children }) {
  const styles = useThemedStyles(getStyles);
  return <View style={styles.navbar}>{children}</View>;
}

const getStyles = (theme) =>
  StyleSheet.create({
    navbar: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 22,
      backgroundColor: theme.post,
      paddingTop: 10,
      paddingBottom: 13,
      borderTopRightRadius: 22,
      borderTopLeftRadius: 22,
      height: 73,
      width: "100%",
      maxWidth:600,
      zIndex: 100,
      alignItems: "center",
      marginHorizontal:'auto'
    },
  });

export default NavCont;

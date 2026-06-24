import { View, StyleSheet } from "react-native";
import AppText from "../../config/AppText";
import useThemedStyles from "../../hooks/useThemedStyles";

function ErrorMessage({ error, full }) {
  const styles = useThemedStyles(getStyles);
  if (!error || error === "") {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        { width: full ? "100%" : "90%", paddingLeft: !full ? 10 : 0 },
      ]}
    >
      <AppText style={styles.text}>{error}</AppText>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: "auto",
    },
    text: {
      color: theme.red,
      fontWeight: "bold",
      fontSize: 14,
    },
  });

export default ErrorMessage;

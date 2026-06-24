import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "../../context/ThemeContext";

function LoadingCircle(props) {
  const { isDarkMode } = useTheme();

  return (
    <View
      style={[
        styles.loadingContainer,
        { backgroundColor: isDarkMode ? "#262626" : "#ECECEC" },
      ]}
    >
      <ActivityIndicator size="large" color={"#007bffff"} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingCircle;

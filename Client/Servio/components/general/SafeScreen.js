import { Platform, StyleSheet, View } from "react-native";
import useThemedStyles from "../../hooks/useThemedStyles";
import { SafeAreaView } from "react-native-safe-area-context";

function SafeScreen({ children, style, gradient }) {
  const styles = useThemedStyles(getStyles);

  if (Platform.OS === "web" && gradient) {
    return (
      <SafeAreaView style={[styles.container, style, styles.webGradient]}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, style, gradient && styles.gradient]}
    >
      {children}
    </SafeAreaView>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    gradient: {
      experimental_backgroundImage: `linear-gradient(147deg, ${theme.g1} 0%, ${theme.g2} 11%, ${theme.g3} 23%, ${theme.g4} 70%, ${theme.g5} 80%, ${theme.g6} 100%, ${theme.g7} 100%)`,
    },
    webGradient: {
      backgroundImage: `linear-gradient(147deg, ${theme.g1} 0%, ${theme.g2} 11%, ${theme.g3} 23%, ${theme.g4} 70%, ${theme.g5} 80%, ${theme.g6} 100%, ${theme.g7} 100%)`,
    },
  });

export default SafeScreen;

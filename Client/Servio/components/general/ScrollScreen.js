import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useTheme } from "../../context/ThemeContext";

function ScrollScreen({
  children,
  stickyHeader,
  stickyHeaderIndices,
  onRefresh,
  refreshing,
  containerStyle,
  style,
  ...other
}) {
  const { theme } = useTheme();
  return (
    <ScrollView
      style={[styles.container, style]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[{ paddingBottom: 40, paddingTop: 20 }, containerStyle]}
      scrollEventThrottle={30}
      stickyHeaderIndices={stickyHeaderIndices}
      stickyHeaderHiddenOnScroll={stickyHeader}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
            colors={[theme.blue]}
            progressBackgroundColor={theme.white}
          />
        ) : null
      }
      {...other}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    marginHorizontal: "auto",
    maxWidth:600,
  },
});

export default ScrollScreen;

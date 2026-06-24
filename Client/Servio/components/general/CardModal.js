import { View, StyleSheet, Pressable, Modal } from "react-native";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";

function CardModal({ children, isVisibile, onClose }) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();

  return (
    <Modal transparent={true} visible={isVisibile}>
      <View style={styles.container}>{children}</View>
      <Pressable onPress={onClose}>
        <View style={styles.overlay}></View>
      </Pressable>
    </Modal>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      width: "90%",
      maxWidth:600,
      margin: "auto",

      backgroundColor: theme.post,
      zIndex: 250,
      borderRadius: 15,
      paddingHorizontal: 20,
      paddingVertical: 25,

      boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.14)",
    },
    overlay: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: theme.background,
      opacity: 0.5,
    },
    display: {
      width: "100%",
      backgroundColor: theme.light_gray,
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 10,
      gap: 10,
      marginTop: 30,
      marginBottom: 30,
    },
  });

export default CardModal;

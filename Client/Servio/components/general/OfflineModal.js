import { useState, useEffect } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useNetInfo } from "@react-native-community/netinfo";
import GhostBtn from "./GhostBtn";
import SText from "../text/SText";
import { UseCar } from "../../context/CarContext";
import { UseService } from "../../context/ServiceContext";
import { UseAppointment } from "../../context/AppointmentContext";
import { UseShop } from "../../context/ShopContext";
import { UseUser } from "../../context/UserContext";

function OfflineModal(props) {
  const { theme } = useTheme();
  const styles = useThemedStyles(getStyles);
  const netinfo = useNetInfo();

  const { loadUserData, isShopOwner } = UseUser();
  const { loadCars } = UseCar();
  const { loadServices } = UseService();
  const { loadAppointments } = UseAppointment();
  const { loadShops } = UseShop();

  const [showOffline, setShowOffline] = useState(false);

  const handleRetry = async () => {
    loadUserData();
    loadCars();
    loadServices();
    loadAppointments();
    if (isShopOwner) loadShops();
  };

  useEffect(() => {
    let timer;
    if (netinfo.type !== "unknown" && netinfo.isInternetReachable === false) {
      // wait 2s before showing the modal
      timer = setTimeout(() => setShowOffline(true), 2000);
    } else {
      // clear modal immediately when back online
      clearTimeout(timer);
      setShowOffline(false);
    }
    return () => clearTimeout(timer);
  }, [netinfo]);

  if (!showOffline) return null;

  return (
    <Modal transparent>
      <View style={styles.container}>
        <Feather name="wifi-off" size={100} color={theme.red} />
        <GhostBtn
          red
          style={styles.btn}
          full
          title={"Retry"}
          onPress={handleRetry}
        />
      </View>
      <View style={styles.overlay} />
    </Modal>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      zIndex: 100,
      backgroundColor: theme.post,
      margin: "auto",
      paddingTop: 40,
      paddingBottom: 30,
      width: "70%",
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    text: {
      color: theme.red,
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
    },
    overlay: {
      position: "absolute",
      inset: 0,
      backgroundColor: theme.background,
      zIndex: 90,
      opacity: 0.5,
    },
    btn: {
      marginTop: 20,
    },
  });

export default OfflineModal;

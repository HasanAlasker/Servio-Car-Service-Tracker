import { View, StyleSheet, Modal, Pressable } from "react-native";
import { useState } from "react";
import useThemedStyles from "../../hooks/useThemedStyles";
import GapContainer from "../general/GapContainer";
import SText from "../text/SText";
import { useTheme } from "../../context/ThemeContext";
import { getTimeFromDate } from "../../functions/fromatTime";
import { formatDate } from "../../functions/formatDate";
import IconTextLabel from "../general/IconTextLabel";
import { confirmAppointment } from "../../api/appointment";
import { addThirtyMinutes, to24Hour } from "../../functions/addOneHour";
import BackContainer from "../general/BackContainer";
import MenuBackBtn from "../general/MenuBackBtn";
import SimpleTitleText from "../general/SimpleTitleText";
import PriBtn from "../general/PriBtn";
import MText from "../text/MText";

function AppModal({ from, to, isVisible, onClose, id, onApproval }) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();
  const [hasBeenSubmited, setHasBeenSubmited] = useState(false);
  const [err, setErr] = useState(null);

  const toInitial = to24Hour(getTimeFromDate(addThirtyMinutes(from)));

  const handleSubmit = async () => {
    setHasBeenSubmited(true);
    try {
      const data = {
        to: toInitial,
      };
      const response = await confirmAppointment(id, data);
      if (response.ok) {
        onApproval(id);
        onClose();
      } else setErr(response.data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setHasBeenSubmited(false);
    }
  };

  return (
    <Modal transparent visible={isVisible}>
      <Pressable onPress={onClose} style={styles.overlay} />
      <GapContainer style={styles.container}>
        <BackContainer>
          <MenuBackBtn
            style={{ marginBottom: 0 }}
            onClose={() => {
              onClose();
            }}
          />
        </BackContainer>
        <GapContainer
          gap={5}
          style={{ width: "90%", marginHorizontal: "auto", hieght: "100%" }}
        >
          <IconTextLabel
            icon={"calendar-blank-outline"}
            text={formatDate(from)}
          />
          <IconTextLabel
            icon={"clock-outline"}
            text={getTimeFromDate(from) + " - " + getTimeFromDate(to)}
          />
        </GapContainer>

        <GapContainer gap={15}>
          <PriBtn
            square
            title={hasBeenSubmited ? "Confirming..." : "Confirm"}
            onPress={handleSubmit}
            disabled={hasBeenSubmited}
          />
        </GapContainer>
      </GapContainer>
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
      paddingVertical: 20,
      borderRadius: 18,
      zIndex: 100,
    },
    overlay: {
      position: "absolute",
      inset: 0,
      backgroundColor: "black",
      zIndex: 90,
      opacity: 0.5,
    },
    grayBox: {
      margin: "auto",
      backgroundColor: theme.faded + 50,
      width: "90%",
      paddingHorizontal: 10,
      paddingVertical: 15,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: theme.faded,
    },
  });

export default AppModal;

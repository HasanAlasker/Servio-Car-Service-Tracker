import { View, StyleSheet, Modal, FlatList, StatusBar } from "react-native";
import BackContainer from "../general/BackContainer";
import MenuBackBtn from "../general/MenuBackBtn";
import SeparatorComp from "../general/SeparatorComp";
import MenuOption from "../general/MenuOption";
import { reportReasons } from "../../constants/dropList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useThemedStyles from "../../hooks/useThemedStyles";
import { makeReport } from "../../api/report";
import useAppToast from "../../hooks/useAppToast";

function ReportModal({
  visible,
  disabled,
  onClose,
  appointmentId,
  setReportId,
}) {
  const styles = useThemedStyles(getStyles);
  const insets = useSafeAreaInsets();
  const toast = useAppToast();

  const handleSelectItem = async (item) => {
    try {
      const res = await makeReport(appointmentId, { reason: item.value });
      if (res.ok) {
        toast.success("Sent!");
      }
      if (res.data.message == "Appointment already reported")
        toast.error("Already reported!");
    } catch (error) {
      toast.error("Failed!");
    } finally {
      setReportId(null);
      onClose();
    }
  };

  const renderItem = ({ item }) => {
    return (
      <MenuOption
        text={item.label}
        onPress={() => handleSelectItem(item)}
        disabled={disabled}
        showLock={disabled}
      />
    );
  };

  return (
    <Modal visible={visible && !disabled} animationType="slide" transparent>
      <View style={[styles.modalContent, { paddingBottom: insets.bottom + 5 }]}>
        <BackContainer style={styles.back}>
          <MenuBackBtn onClose={() => onClose()} />
        </BackContainer>

        <FlatList
          data={reportReasons}
          keyExtractor={(item) => item.value.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <SeparatorComp full style={styles.sep} color="faded" />
          )}
          contentContainerStyle={styles.list}
        />
      </View>
    </Modal>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    back: {
      marginVertical: 0,
    },
    modalContent: {
      paddingTop: StatusBar.currentHeight,
      backgroundColor: theme.post,
      borderRadius: 20,
      flex: 1,
    },
    list: {
      width: "90%",
      marginHorizontal: "auto",
      paddingBottom: 20,
    },
    sep: {
      width: "100%",
      marginTop: 5,
      marginBottom: 5,
    },
  });

export default ReportModal;

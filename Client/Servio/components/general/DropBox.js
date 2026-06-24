import { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  StatusBar,
  Platform,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";
import AppText from "../../config/AppText";
import BackContainer from "./BackContainer";
import MenuBackBtn from "./MenuBackBtn";
import SeparatorComp from "./SeparatorComp";
import MenuOption from "./MenuOption";
import InputCont from "./InputCont";
import TText from "../text/TText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function DropBox({
  placeholder,
  penOn,
  items,
  onSelectItem,
  selectedValue,
  disabled,
  lable = placeholder,
  icon,
}) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [modal, setModal] = useState(false);

  const selectedItem = items.find((item) => item.value === selectedValue);
  const displayText = selectedItem ? selectedItem.label : placeholder;

  const handlePress = () => {
    if (!disabled) {
      setModal(true);
    }
  };

  const handleSelectItem = (item) => {
    setModal(false);
    onSelectItem(item.value);
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
    <>
      <InputCont style={styles.whole}>
        <TText thin color={"darker_gray"}>
          {lable}
        </TText>
        <Pressable
          onPress={handlePress}
          style={[styles.container, disabled && styles.disabled]}
          disabled={disabled}
        >
          <View style={styles.left}>
            {penOn && <Feather name="edit-3" size={24} color={theme.blue} />}
            {icon && (
              <MaterialCommunityIcons
                name={icon}
                size={24}
                color={theme.main_text}
              />
            )}
            <AppText
              style={[
                styles.text,
                disabled && styles.disabledText,
                !selectedItem && styles.placeholder,
                { top: Platform.OS === "web" && 4 },
              ]}
            >
              {displayText}
            </AppText>
          </View>
          <Feather name="chevron-down" size={26} color={theme.main_text} />
        </Pressable>
      </InputCont>

      <Modal visible={modal && !disabled} animationType="slide" transparent>
        <View
          style={[styles.modalContent, { paddingBottom: insets.bottom + 5 }]}
        >
          <BackContainer style={styles.back}>
            <MenuBackBtn
              onClose={() => {
                setModal(false);
              }}
            />
          </BackContainer>

          <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <SeparatorComp full style={styles.sep} color="faded" />
            )}
            contentContainerStyle={styles.list}
          />
        </View>
      </Modal>
    </>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    back: {
      marginVertical: 0,
      maxWidth: 600,
    },
    container: {
      flexDirection: "row",
      borderRadius: 15,
      borderColor: theme.faded,
      borderWidth: 1,
      justifyContent: "space-between",
      backgroundColor: theme.post,
      paddingVertical: 10,
      paddingHorizontal: 15,
      width: "100%",
      marginHorizontal: "auto",
      overflow: "hidden",
    },
    text: {
      color: theme.darker_gray,
      fontSize: 16,
      textAlignVertical: "center",
    },
    left: {
      flexDirection: "row",
      gap: 10,
      flex: 1,
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
      maxWidth: 600,
    },
    sep: {
      width: "100%",
      marginTop: 5,
      marginBottom: 5,
    },
    disabled: {
      opacity: 0.6,
    },
    placeholder: {
      opacity: 0.6,
    },
  });

export default DropBox;

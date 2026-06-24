import { StyleSheet } from "react-native";
import CardComp from "./CardComp";
import { capFirstLetter } from "../../functions/CapFirstLetterOfWord";
import { formatDate } from "../../functions/formatDate";
import GapContainer from "../general/GapContainer";
import CardLeftBorder from "./CardLeftBorder";
import { useNavigation } from "@react-navigation/native";
import { UseUser } from "../../context/UserContext";
import SimpleTitleText from "../general/SimpleTitleText";
import RowCont from "../general/RowCont";
import GhostBtn from "../general/GhostBtn";
import VerticalLine from "../general/VerticalLine";
import SquareTitle from "../general/SquareTitle";
import SeparatorComp from "../general/SeparatorComp";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import SquareInfo from "./SquareInfo";

function ServiceCard({
  id,
  car,
  customer,
  dueBy,
  parts,
  status,
  sendNotifications,
  handleReminder,
}) {
  const navigate = useNavigation();
  const { theme } = useTheme();
  const { isShopOwner, userLocation, fetchUserLocation } = UseUser();
  const [showBtns, setShowBtns] = useState(false);

  const sendParams = {
    car: car,
    customer,
    parts,
    showBtn: true,
  };

  const handlePress = async () => {
    navigate.navigate("Shops", sendParams);
    await fetchUserLocation();
  };

  return (
    <CardComp style={styles.container} onPress={() => setShowBtns(!showBtns)}>
      <GapContainer gap={8}>
        <RowCont style={{ justifyContent: "space-between" }}>
          <SquareInfo
            icon={"car"}
            text={car?.mileage.toLocaleString() + " " + car?.unit}
            title={capFirstLetter(car?.make) + " " + capFirstLetter(car?.name)}
          />
          <Feather
            name={!showBtns ? "chevron-right" : "chevron-down"}
            color={theme.sec_text}
            size={25}
            style={{ alignSelf: "center" }}
          />
        </RowCont>

        <SeparatorComp full color="faded" />

        <CardLeftBorder noPadding status={status} parts={parts} />
        <SeparatorComp full color="faded" />
        <SimpleTitleText
          text1={formatDate(dueBy.date)}
          text2={
            dueBy.mileage.toLocaleString() + " " + capFirstLetter(car?.unit)
          }
          title={"Service at"}
        />

        {showBtns && (
          <>
            <SeparatorComp full color="faded" />
            <RowCont>
              {!isShopOwner && (
                <GhostBtn auto blue title={"Reserve"} onPress={handlePress} />
              )}
              {!isShopOwner && <VerticalLine />}
              <GhostBtn
                auto={!isShopOwner}
                full={isShopOwner}
                black
                title={sendNotifications ? "Mute" : "Remind"}
                onPress={() => handleReminder(id, sendNotifications)}
              />
            </RowCont>
          </>
        )}
      </GapContainer>
    </CardComp>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ServiceCard;

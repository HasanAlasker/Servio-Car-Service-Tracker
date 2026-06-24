import { View, StyleSheet, Linking } from "react-native";
import CardComp from "./CardComp";
import GapContainer from "../general/GapContainer";
import SText from "../text/SText";
import SimpleTitleText from "../general/SimpleTitleText";
import { formatDateTime } from "../../functions/formatDateTime";
import { capFirstLetter } from "../../functions/CapFirstLetterOfWord";
import SquareInfo from "./SquareInfo";
import SeparatorComp from "../general/SeparatorComp";
import RowCont from "../general/RowCont";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import StatusLabel from "../general/StatusLabel";
import GhostBtn from "../general/GhostBtn";
import VerticalLine from "../general/VerticalLine";

function ReportCard({
  id,
  status,
  reason,
  appointment,
  reporter,
  shop,
  createdAt,
  updatedAt,
  onClose,
  onOpen,
}) {
  const { theme } = useTheme();

  const [showBtns, setShowBtns] = useState(false);
  const handleCall = async (isUser) => {
    try {
      if (isUser) await Linking.openURL(`tel:${reporter?.phone}`);
      else await Linking.openURL(`tel:${shop?.phone}`);
    } catch (error) {}
  };

  const cutYear = (date) => {
    const fullDate = formatDateTime(date);
    let [newDate, time] = fullDate.split(",");
    time = time.split("at")[1];
    return newDate + " -" + time;
  };

  return (
    <CardComp onPress={() => setShowBtns(!showBtns)}>
      <GapContainer gap={6}>
        <RowCont spaceBetween>
          <SquareInfo
            icon={"bullhorn-variant-outline"}
            title={capFirstLetter(reason)}
            text={cutYear(createdAt)}
          />
          <Feather
            name={!showBtns ? "chevron-right" : "chevron-down"}
            color={theme.sec_text}
            size={25}
          />
        </RowCont>

        {status === "closed" && <SeparatorComp full color="faded" />}
        {status === "closed" && (
          <SimpleTitleText
            title={"Closed in"}
            text1={formatDateTime(updatedAt)}
          />
        )}

        <SeparatorComp full color="faded" />
        <RowCont>
          <SimpleTitleText
            title={"Reporter"}
            text1={capFirstLetter(reporter.name)}
          />

          <Feather
            name="phone"
            size={20}
            color={theme.sec_text}
            onPress={() => handleCall(true)}
          />
        </RowCont>
        <SeparatorComp full color="faded" />
        <RowCont>
          <SimpleTitleText
            title={"Reported Shop"}
            text1={capFirstLetter(shop.name)}
            text2={shop.rating.toFixed(1)}
          />
          <Feather
            name="phone"
            color={theme.sec_text}
            size={20}
            onPress={() => handleCall(false)}
          />
        </RowCont>
        {status === "open" && <SeparatorComp full color="faded" />}
        {status === "open" && (
          <RowCont spaceBetween>
            <SimpleTitleText
              text1={
                capFirstLetter(appointment.car.make) +
                " " +
                capFirstLetter(appointment.car.name)
              }
              title={cutYear(appointment.scheduledDate)}
            />
            <StatusLabel
              status={appointment.status}
              style={{ alignSelf: "center" }}
            />
          </RowCont>
        )}

        {showBtns && (
          <>
            <SeparatorComp full color="faded" />

            {status === "open" && (
              <GhostBtn title={"Close"} full onPress={() => onClose(id)} />
            )}
            {status === "closed" && (
              <GhostBtn title={"Open"} full red onPress={() => onOpen(id)} />
            )}
          </>
        )}
      </GapContainer>
    </CardComp>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ReportCard;

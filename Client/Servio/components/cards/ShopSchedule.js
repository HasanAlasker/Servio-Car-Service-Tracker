import { View, StyleSheet, Pressable } from "react-native";
import GapContainer from "../general/GapContainer";
import RowCont from "../general/RowCont";
import SText from "../text/SText";
import { Feather } from "@expo/vector-icons";
import useApi from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { getSlots } from "../../api/slots";
import TimeSlot from "./TimeSlot";
import { useTheme } from "../../context/ThemeContext";
import LoadingSkeleton from "../loading/LoadingSkeleton";

function ShopSchedule({ shopId, name }) {
  const [showSlots, setShowSlots] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const { theme } = useTheme();

  const {
    data: slots,
    request: fetchSlots,
    loading: loadingSlots,
    error,
  } = useApi(getSlots);

  useEffect(() => {
    fetchSlots(shopId, today);
  }, [shopId]);

  const SlotList = slots
    ? slots?.slots?.map((s) => (
        <TimeSlot key={s.from} from={s.from} to={s.to} isBusy={s.isBusy} full />
      ))
    : null;

  return (
    <GapContainer style={{ marginTop: 10 }}>
      <Pressable onPress={() => setShowSlots(!showSlots)}>
        <RowCont style={{ justifyContent: "space-between" }}>
          <SText>{name}</SText>
          <Feather
            color={theme.sec_text}
            size={24}
            name={!showSlots ? "chevron-down" : "chevron-up"}
          />
        </RowCont>
      </Pressable>
      {showSlots &&
        (slots.isOpen ? (
          SlotList
        ) : (
          <TimeSlot
            full
            isBusy={true}
            from={"Shop is"}
            to={"Closed"}
            selected={false}
          />
        ))}
      {showSlots && loadingSlots && <LoadingSkeleton />}
    </GapContainer>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ShopSchedule;

import { StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import Navbar from "../../components/general/Navbar";
import GapContainer from "../../components/general/GapContainer";
import { UseShop } from "../../context/ShopContext";
import ShopSchedule from "../../components/cards/ShopSchedule";
import MText from "../../components/text/MText";
import SText from "../../components/text/SText";

function Schedule(props) {
  const { shops, loading: loadingShops } = UseShop();

  const ShopList = shops.map((s) => (
    <ShopSchedule key={s._id} name={s.name} shopId={s._id} />
  ));

  return (
    <SafeScreen>
      <ScrollScreen>
        <GapContainer>
          <MText style={{ marginBottom: 20 }}>Today's Schedule</MText>
          {ShopList.length > 0 ? (
            ShopList
          ) : (
            <SText
              thin
              color={"sec_text"}
              style={{ margin: "auto", textAlign: "center" }}
            >
              No appointments here
            </SText>
          )}
        </GapContainer>
      </ScrollScreen>
      <Navbar />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default Schedule;

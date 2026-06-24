import { View, StyleSheet } from "react-native";
import GapContainer from "./GapContainer";
import CardLeftBorder from "../cards/CardLeftBorder";
import { UseShop } from "../../context/ShopContext";
import useApi from "../../hooks/useApi";
import { countDocs, shopCountDocs } from "../../api/user";
import { useEffect } from "react";
import { UseUser } from "../../context/UserContext";
import SText from "../text/SText";

function ShopInfo(props) {
  const { countShops } = UseShop();
  const { user } = UseUser();

  const { data, request: fetchDocs, loading } = useApi(countDocs);

  const { data: shopData, request: fetchShop } = useApi(shopCountDocs);

  useEffect(() => {
    fetchDocs();
    fetchShop();
  }, [user]);
  return (
    <GapContainer>
      <SText thin color={"sec_text"}>
        Shop Info
      </SText>

      <View style={styles.grid}>
        <CardLeftBorder
          title={"Active Shops: "}
          titleIcon={"zap"}
          data={countShops()}
          style={styles.container}
        />
        {shopData.newShops > 0 && (
          <CardLeftBorder
            title={"Unverified: "}
            titleIcon={"shopping-bag"}
            data={loading ? "0" : shopData.newShops}
            style={styles.container}
          />
        )}
        <CardLeftBorder
          title={"New Books: "}
          titleIcon={"book-open"}
          data={loading ? "0" : shopData.requests}
          style={styles.container}
        />
      </View>
    </GapContainer>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
    gap: 20,
  },
  container: {
    flexGrow: 1,

    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.14)",
  },
});

export default ShopInfo;

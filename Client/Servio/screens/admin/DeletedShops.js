import { Platform, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import Navbar from "../../components/general/Navbar";
import useApi from "../../hooks/useApi";
import { getDeletedShops, undeleteShop } from "../../api/shop";
import { useEffect, useState } from "react";
import ShopCard from "../../components/cards/ShopCard";
import SText from "../../components/text/SText";
import GapContainer from "../../components/general/GapContainer";
import LText from "../../components/text/LText";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { useShopStore } from "../../store/admin/useShopStore";

function DeletedShops(props) {
  const deletedShops = useShopStore((state) => state.deletedShops);
  const loading = useShopStore((state) => state.loading);
  const loadShops = useShopStore((state) => state.loadShops);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await loadShops();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  const RenderShops = deletedShops?.map((shop) => (
    <ShopCard
      key={shop._id}
      id={shop._id}
      name={shop.name}
      address={shop.address}
      description={shop.description}
      image={shop?.image}
      openHours={shop.openHours}
      rating={shop.rating}
      ratingCount={shop.ratingCount}
      services={shop.services}
      isVerified={shop.isVerified}
      isDeleted={shop.isDeleted}
    />
  ));

  return (
    <SafeScreen>
      <ScrollScreen
        {...(Platform.OS !== "web" && { refreshing, onRefresh: refresh })}
      >
        <GapContainer>
          <LText>Deleted Shops</LText>
          {RenderShops}
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}

          {!loading && deletedShops?.length === 0 && (
            <SText
              thin
              color={"sec_text"}
              style={{ margin: "auto", textAlign: "center" }}
            >
              There are no deleted shops
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

export default DeletedShops;

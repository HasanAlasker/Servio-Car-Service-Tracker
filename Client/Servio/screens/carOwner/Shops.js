import { Platform, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import Navbar from "../../components/general/Navbar";
import ScrollScreen from "../../components/general/ScrollScreen";
import ShopCard from "../../components/cards/ShopCard";
import useApi from "../../hooks/useApi";
import { getNearbyShops } from "../../api/shop";
import { useEffect, useState } from "react";
import GapContainer from "../../components/general/GapContainer";
import { useRoute } from "@react-navigation/native";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { UseUser } from "../../context/UserContext";
import SText from "../../components/text/SText";
import SearchBar from "../../components/general/SearchBar";

function Shops(props) {
  const { userLocation } = UseUser();
  const [shops, setShops] = useState([]);
  const [filter, setFilter] = useState("");

  const route = useRoute();
  const params = route?.params;

  const {
    data: fetchedShops,
    request: fetchShops,
    loading,
  } = useApi(getNearbyShops);

  useEffect(() => {
    if (!userLocation) return;
    fetchShops(userLocation);
  }, [userLocation]);

  useEffect(() => {
    setShops(fetchedShops);
  }, [fetchedShops]);

  const filteredShops = shops?.filter((s) => {
    const query = filter.toLowerCase();
    return (
      s.name?.toLowerCase().includes(query) ||
      s.description?.toLowerCase().includes(query) ||
      s.rating?.toString().toLowerCase().includes(query) ||
      s.address?.city?.toLowerCase().includes(query) ||
      s.address?.area?.toLowerCase().includes(query) ||
      s.address?.street?.toLowerCase().includes(query) ||
      s.services?.some((service) => service.name?.toLowerCase().includes(query))
    );
  });

  const showEmpty =
    !loading && fetchedShops !== null && filteredShops.length === 0;

  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    try {
      setRefreshing(true);
      if (userLocation) await fetchShops(userLocation);
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const RenderShops =
    filteredShops.length > 0 ? (
      filteredShops?.map((shop) => (
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
          serviceData={params}
        />
      ))
    ) : (
      <SText
        thin
        color={"sec_text"}
        style={{ margin: "auto", textAlign: "center" }}
      >
        {!userLocation && !loading
          ? "Location required"
          : showEmpty
            ? "No shops registered in your city"
            : filter && !loading
              ? "No results found"
              : null}
      </SText>
    );

  return (
    <SafeScreen>
      <ScrollScreen
        {...(Platform.OS !== "web" && { refreshing, onRefresh: refresh })}
        stickyHeader
        stickyHeaderIndices={[0]}
      >
        <SearchBar onChangeText={setFilter} />

        <GapContainer>
          {RenderShops}
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
        </GapContainer>
      </ScrollScreen>
      <Navbar />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default Shops;

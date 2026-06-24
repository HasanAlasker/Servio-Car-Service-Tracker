import { Platform, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import Navbar from "../../components/general/Navbar";
import { useNavigation } from "@react-navigation/native";
import ShopCard from "../../components/cards/ShopCard";
import GapContainer from "../../components/general/GapContainer";
import { UseShop } from "../../context/ShopContext";
import { useState } from "react";

function ShopBook(props) {
  const { shops, loadShops } = UseShop();
  const [refreshing, setRefresing] = useState(false);

  const refresh = async () => {
    loadShops();
  };

  const navigate = useNavigation();

  const RenderShops = shops.map((shop) => (
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
      onCardPress={() =>
        navigate.navigate("ShopAppointments", { shopId: shop._id })
      }
      mini
    />
  ));
  return (
    <SafeScreen>
      <ScrollScreen
        {...(Platform.OS !== "web" && { refreshing, onRefresh: refresh })}
      >
        <GapContainer>{RenderShops}</GapContainer>
      </ScrollScreen>
      <Navbar />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ShopBook;

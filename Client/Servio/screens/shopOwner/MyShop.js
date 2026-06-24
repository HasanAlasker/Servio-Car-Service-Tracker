import { StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import Navbar from "../../components/general/Navbar";
import ShopCard from "../../components/cards/ShopCard";
import { useNavigation } from "@react-navigation/native";
import AddCarCard from "../../components/cards/AddCarCard";
import GapContainer from "../../components/general/GapContainer";
import { UseShop } from "../../context/ShopContext";

function MyShop(props) {
  const { shops, setShops, loading } = UseShop();
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
      onCardPress={() => navigate.navigate("AddShop", shop)}
    />
  ));

  return (
    <SafeScreen>
      <ScrollScreen>
        <GapContainer>
          {RenderShops}
          <AddCarCard
            color={"blue"}
            text={"Add Shop"}
            icon={"plus"}
            navigateTo={"AddShop"}
          />
        </GapContainer>
      </ScrollScreen>
      <Navbar />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default MyShop;

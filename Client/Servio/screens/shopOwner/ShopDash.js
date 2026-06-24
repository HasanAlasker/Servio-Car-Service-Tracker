import { Platform, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import Navbar from "../../components/general/Navbar";
import GapContainer from "../../components/general/GapContainer";
import OfflineModal from "../../components/general/OfflineModal";
import UsersDash from "../../components/general/UsersDash";
import ShopInfo from "../../components/general/ShopInfo";
import HelloUser from "../../components/general/HelloUser";
import { UseShop } from "../../context/ShopContext";
import EmptyGarage from "../../components/general/EmptyGarage";
import { useState } from "react";
import { UseService } from "../../context/ServiceContext";

function Home(props) {
  const { shops, loading, loadShops } = UseShop();
  const { loadServices } = UseService();

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

  return (
    <SafeScreen>
      <ScrollScreen
        {...(Platform.OS !== "web" && { refreshing, onRefresh: refresh })}
      >
        <GapContainer gap={40}>
          <HelloUser />
          {shops.length > 0 && <UsersDash />}
          {shops.length > 0 && <ShopInfo />}
          {shops.length === 0 && !loading && (
            <EmptyGarage
              title={"You have no shops yet!"}
              text={"Open your first shop to start tracking appointments"}
              btn={"Open Shop"}
              navigateTo={"AddShop"}
            />
          )}
        </GapContainer>
      </ScrollScreen>
      <Navbar />
      <OfflineModal />
    </SafeScreen>
  );
}

export default Home;

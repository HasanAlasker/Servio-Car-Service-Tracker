import SafeScreen from "../../components/general/SafeScreen";
import OfflineModal from "../../components/general/OfflineModal";
import Navbar from "../../components/general/Navbar";
import ScrollScreen from "../../components/general/ScrollScreen";
import GapContainer from "../../components/general/GapContainer";
import HelloUser from "../../components/general/HelloUser";
import AdminDash from "../../components/general/AdminDash";
import QuickActions from "../../components/general/QuickActions";
import { Platform } from "react-native";
import { useState } from "react";
import { useAdminStore } from "../../store/admin/useAdminStore";

function Dash(props) {
  const [refreshing, setRefreshing] = useState(false);
  const loadDashbord = useAdminStore((state) => state.loadDashbord);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await loadDashbord();
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
          <QuickActions />
          <AdminDash />
        </GapContainer>
      </ScrollScreen>
      <Navbar />
      <OfflineModal />
    </SafeScreen>
  );
}

export default Dash;

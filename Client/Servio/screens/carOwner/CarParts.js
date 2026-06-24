import { Platform, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import Navbar from "../../components/general/Navbar";
import AddCarCard from "../../components/cards/AddCarCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import GapContainer from "../../components/general/GapContainer";
import useApi from "../../hooks/useApi";
import { getTrackedParts, servicePart } from "../../api/part";
import PartCard from "../../components/cards/PartCard";
import CarOptionsCard from "../../components/cards/CarOptionsCard";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import InfoCard from "../../components/cards/InfoCard";
import { UseService } from "../../context/ServiceContext";
import useAppToast from "../../hooks/useAppToast";
import MenuBackBtn from "../../components/general/MenuBackBtn";
import { UseUser } from "../../context/UserContext";

function CarParts(props) {
  const { showPartNote, hideNote } = UseUser();
  const [parts, setParts] = useState([]);
  const { loadServices } = UseService();
  const toast = useAppToast();
  const navigate = useNavigation();
  const route = useRoute();
  const params = route?.params;

  const [refreshing, setRefreshing] = useState(false);

  const {
    data: fetchedParts,
    request: fetchParts,
    loading,
  } = useApi(getTrackedParts);

  useEffect(() => {
    fetchParts(params?.id);
  }, []);

  useEffect(() => {
    setParts(fetchedParts);
  }, [fetchedParts]);

  const refresh = async () => {
    try {
      setRefreshing(true);
      fetchParts();
    } catch (error) {
      toast.error("Error!");
    } finally {
      setRefreshing(false);
    }
  };

  const handleService = async (partId) => {
    try {
      const updatedMileage = params.mileage;
      const updatedDate = new Date();
      const updatedPart = parts.find((p) => p._id === partId);
      setParts((prev) =>
        prev.map((p) =>
          p._id === updatedPart._id
            ? {
                ...p,
                lastChangeDate: updatedDate,
                lastChangeMileage: updatedMileage,
              }
            : p,
        ),
      );

      const response = await servicePart(partId);
      if (response.ok) {
        loadServices();
      }
      if (!response.ok) toast.error("Failed!");
    } catch (error) {
      console.error("handleService error:", error);
    }
  };

  const RenderParts = parts.map((part) => (
    <PartCard
      key={part._id}
      part={part}
      parentParams={params}
      unit={params.unit}
      handleService={handleService}
    />
  ));

  return (
    <SafeScreen>
      <ScrollScreen
        {...(Platform.OS !== "web" && { refreshing, onRefresh: refresh })}
      >
        <MenuBackBtn onClose={() => navigate.navigate("MyCars")} />
        <GapContainer>
          <CarOptionsCard params={params} />
          {RenderParts}
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
          <AddCarCard
            text={"Add Part"}
            icon={"car-cog"}
            color={"blue"}
            navigateTo={"AddPart"}
            params={params}
          />
          {showPartNote && RenderParts.length === 0 && !loading && (
            <InfoCard
              title={"How it works?"}
              text={
                "Add your car parts and we'll automatically calculate when they're next due for service."
              }
              close
              onClose={() => hideNote("partNote")}
            />
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

export default CarParts;

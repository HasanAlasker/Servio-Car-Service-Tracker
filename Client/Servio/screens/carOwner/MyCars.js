import { Platform, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import Navbar from "../../components/general/Navbar";
import ScrollScreen from "../../components/general/ScrollScreen";
import AddCarCard from "../../components/cards/AddCarCard";
import GapContainer from "../../components/general/GapContainer";
import SText from "../../components/text/SText";
import CarCard from "../../components/cards/CarCard";
import { UseCar } from "../../context/CarContext";
import { useState } from "react";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";

function MyCars(props) {
  const { cars, loading, loadCars } = UseCar();
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    try {
      setRefreshing(true);
      await loadCars();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const carsList = cars.map((car) => (
    <CarCard
      key={car._id}
      id={car._id}
      image={car?.image}
      make={car.make}
      name={car.name}
      model={car.model}
      plateNumber={car.plateNumber}
      color={car?.color}
      mileage={car.mileage}
      unit={car?.unit}
    />
  ));

  return (
    <SafeScreen>
      <ScrollScreen
        {...(Platform.OS !== "web" && { refreshing, onRefresh: refresh })}
      >
        <GapContainer>
          {carsList.length === 0 && !loading ? (
            <SText
              thin
              color={"sec_text"}
              style={{ marginHorizontal: "auto", textAlign: "center" }}
            >
              You haven't added any cars yet
            </SText>
          ) : (
            carsList
          )}

          {loading && <LoadingSkeleton />}

          <AddCarCard
            text={"Add Car"}
            icon={"plus"}
            color={"blue"}
            navigateTo={"AddCar"}
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

export default MyCars;

import { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import AddCarCard from "../../components/cards/AddCarCard";
import CarCard from "../../components/cards/CarCard";
import EmptyState from "../../components/general/EmptyState";
import GapContainer from "../../components/general/GapContainer";
import Navbar from "../../components/general/Navbar";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { UseCar } from "../../context/CarContext";

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
            <EmptyState
              text={"You haven't added any cars"}
              lottie={require("../../assets/animations/car.json")}
              loop
              animationHeight={170}
              action
              navigateTo={"AddCar"}
            />
          ) : (
            carsList
          )}

          {loading && <LoadingSkeleton />}

          {carsList.length !== 0 && !loading && (
            <AddCarCard
              text={"Add Car"}
              icon={"plus"}
              color={"blue"}
              navigateTo={"AddCar"}
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

export default MyCars;

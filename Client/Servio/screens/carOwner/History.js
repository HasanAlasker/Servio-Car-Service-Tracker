import { Platform, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import { UseCar } from "../../context/CarContext";
import { useState } from "react";
import CarCard from "../../components/cards/CarCard";
import GapContainer from "../../components/general/GapContainer";
import SText from "../../components/text/SText";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import Navbar from "../../components/general/Navbar";
import { getCarHistory } from "../../api/appointment";
import AppointmentCard from "../../components/cards/AppointmentCard";
import MenuBackBtn from "../../components/general/MenuBackBtn";

function History(props) {
  const { cars, loading, loadCars } = UseCar();
  const [refreshing, setRefreshing] = useState(false);
  const [past, setPast] = useState(null);
  const [showCarHistory, setShowCarHistory] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const refresh = async () => {
    try {
      setRefreshing(true);
      await loadCars();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const handlePress = async (id) => {
    setSelectedCar(id);
    setShowCarHistory(true);
    setHistoryLoading(true);
    setPast(null); // reset on each press
    try {
      const res = await getCarHistory(id);
      setPast(res.data.data);
    } catch (error) {
      setPast([]); // fallback to empty array on error
    } finally {
      setHistoryLoading(false);
    }
  };

  const carsList = cars.map((car) => (
    <CarCard
      key={car._id}
      id={car._id}
      make={car.make}
      name={car.name}
      model={car.model}
      plateNumber={car.plateNumber}
      color={car?.color}
      mileage={car.mileage}
      unit={car?.unit}
      onPress={handlePress}
    />
  ));

  const RenderAppointments = () => {
    if (past.length !== 0)
      return past?.map((appointment) => (
        <AppointmentCard
          key={appointment._id}
          id={appointment._id}
          customer={appointment?.customer}
          car={appointment.car}
          shop={appointment.shop}
          serviceParts={appointment.serviceParts}
          status={appointment.status}
          scheuledAt={appointment.scheduledDate}
        />
      ));
    else
      return (
        <SText
          thin
          color={"sec_text"}
          style={{ marginHorizontal: "auto", textAlign: "center" }}
        >
          This car has no service history
        </SText>
      );
  };

  return (
    <SafeScreen>
      <ScrollScreen
        {...(Platform.OS !== "web" && { refreshing, onRefresh: refresh })}
      >
        {showCarHistory && (
          <MenuBackBtn onClose={() => setShowCarHistory(false)} />
        )}
        <GapContainer>
          {carsList.length === 0 && !loading && !showCarHistory ? (
            <SText
              thin
              color={"sec_text"}
              style={{ marginHorizontal: "auto", textAlign: "center" }}
            >
              You haven't added any cars yet
            </SText>
          ) : (
            !showCarHistory && carsList
          )}

          {showCarHistory &&
            (historyLoading ? (
              <>
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </>
            ) : (
              past && <RenderAppointments />
            ))}
        </GapContainer>
      </ScrollScreen>
      <Navbar />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default History;

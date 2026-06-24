import { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import Navbar from "../../components/general/Navbar";
import SafeScreen from "../../components/general/SafeScreen";
import { cancelAppointment, deleteAppointment } from "../../api/appointment";
import ScrollScreen from "../../components/general/ScrollScreen";
import AppointmentCard from "../../components/cards/AppointmentCard";
import GapContainer from "../../components/general/GapContainer";
import TabNav from "../../components/general/TabNav";
import { useRoute } from "@react-navigation/native";
import SText from "../../components/text/SText";
import { UseAppointment } from "../../context/AppointmentContext";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import useAppToast from "../../hooks/useAppToast";
import EmptyState from "../../components/general/EmptyState";

function Bookings(props) {
  const toast = useAppToast();
  const { upcoming, past, setUpcoming, setPast, loading, loadAppointments } =
    UseAppointment();
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    try {
      setRefreshing(true);
      await loadAppointments();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const [activeTab, setTab] = useState("1");

  const route = useRoute();
  const params = route.params;

  useEffect(() => {
    if (params) {
      if (params.active) setTab(params.active);
    }
    loadAppointments();
  }, []);

  const handleCancel = async (id, type) => {
    if (type === "1") {
      const canceledApp = upcoming.find((app) => app._id === id);
      canceledApp.status = "canceled";
      setUpcoming((prev) => prev.filter((app) => app._id !== id));
      setPast((prev) => [canceledApp, ...prev]);
    } else {
      const canceledApp = past.find((app) => app._id === id);
      canceledApp.status = "canceled";
      setPast((prev) => prev.filter((app) => app._id !== id));
      setPast((prev) => [canceledApp, ...prev]);
    }
    await cancelAppointment(id);
  };

  const handleDelete = async (id) => {
    try {
      setPast((prev) => prev.filter((app) => app._id !== id));
      const res = await deleteAppointment(id);
      if (!res.ok) toast.error("Appointment in future or active");
    } catch (error) {
      console.log(error);
    }
  };

  const dataSource = activeTab === "1" ? upcoming : past;

  const RenderAppointments = dataSource.map((appointment) => (
    <AppointmentCard
      key={appointment._id}
      id={appointment._id}
      customer={appointment?.customer}
      car={appointment.car}
      shop={appointment.shop}
      serviceParts={appointment.serviceParts}
      status={appointment.status}
      scheuledAt={appointment.scheduledDate}
      type={activeTab}
      onCancel={handleCancel}
      showDelete={activeTab === "2"}
      onDelete={handleDelete}
    />
  ));

  const onTabChange = () => {
    let changeTo = activeTab === "1" ? "2" : "1";
    setTab(changeTo);
  };

  return (
    <SafeScreen>
      <ScrollScreen
        stickyHeader
        stickyHeaderIndices={[0]}
        {...(Platform.OS !== "web" && { refreshing, onRefresh: refresh })}
      >
        <TabNav
          one={"Upcoming"}
          two={"Past"}
          active={activeTab}
          onTabChange={onTabChange}
        />
        <GapContainer>
          {RenderAppointments.length === 0 && !loading ? (
            <EmptyState
              text={"No bookings here"}
              lottie={require("../../assets/animations/calendar.json")}
              loop
              animationHeight={150}
              moveTextUp={5}
              lottieStyle={{left:6}}
            />
          ) : (
            RenderAppointments
          )}
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

export default Bookings;

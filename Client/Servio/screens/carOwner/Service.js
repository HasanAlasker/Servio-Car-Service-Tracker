import { Platform, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import Navbar from "../../components/general/Navbar";
import ScrollScreen from "../../components/general/ScrollScreen";
import GapContainer from "../../components/general/GapContainer";
import { dontRemind, remind } from "../../api/upcomingService";
import ServiceCard from "../../components/cards/ServiceCard";
import SText from "../../components/text/SText";
import { UseService } from "../../context/ServiceContext";
import { useState } from "react";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import InfoCard from "../../components/cards/InfoCard";
import { UseUser } from "../../context/UserContext";
import EmptyState from "../../components/general/EmptyState";

function Service(props) {
  const { showServiceNote, hideNote } = UseUser();
  const { services, setServices, loading, loadServices } = UseService();
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    try {
      setRefreshing(true);
      await loadServices();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const handleReminder = async (id, isActive) => {
    try {
      setServices((prev) =>
        prev.map((service) =>
          service._id === id
            ? {
                ...service,
                reminder: !service.reminder,
              }
            : service,
        ),
      );
      if (isActive) {
        const res = await dontRemind(id);
      } else {
        const res = await remind(id);
      }
    } catch (error) {}
  };

  const RenderServices = services.map((service) => (
    <ServiceCard
      key={service._id}
      id={service._id}
      car={service.car}
      customer={service.customer}
      parts={service.parts}
      dueBy={service.dueBy}
      status={service.status}
      sendNotifications={service.reminder}
      handleReminder={handleReminder}
    />
  ));

  return (
    <SafeScreen>
      <ScrollScreen
        {...(Platform.OS !== "web" && { refreshing, onRefresh: refresh })}
      >
        <GapContainer>
          {RenderServices.length === 0 && !loading ? (
            <EmptyState
              text={"No upcoming services"}
              lottie={require("../../assets/animations/all-set.json")}
              moveTextUp={50}
            />
          ) : (
            RenderServices
          )}
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
          {showServiceNote && RenderServices.length !== 0 && (
            <InfoCard
              title={"Completed a service?"}
              text={'Press "Fixed" on the parts to recalculate.'}
              close
              onClose={() => hideNote("serviceNote")}
            />
          )}
          {RenderServices.length !== 0 && Platform.OS === "web" && (
            <InfoCard
              red
              title={"Warning"}
              text={"Push notifications are not supported on the web"}
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

export default Service;

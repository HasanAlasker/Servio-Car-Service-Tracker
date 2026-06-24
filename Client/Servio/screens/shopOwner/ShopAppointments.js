import { Platform, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import Navbar from "../../components/general/Navbar";
import TabNav from "../../components/general/TabNav";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import useApi from "../../hooks/useApi";
import {
  getConfirmedAppointments,
  getPendingAppointments,
  markAppointmentCompleted,
  markAppointmentNoShow,
  rejectAppointment,
} from "../../api/appointment";
import AppointmentCard from "../../components/cards/AppointmentCard";
import GapContainer from "../../components/general/GapContainer";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import SText from "../../components/text/SText";
import { useBookingStore } from "../../store/shopOwner/useBookingsStore";

function ShopAppointments(props) {
  const [tab, setTab] = useState("1");
  const [pending, setPending] = useState([]);
  const [confirmed, setConfirmed] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadBook = useBookingStore((state) => state.loadBook);

  const route = useRoute();
  const { shopId } = route.params;

  const {
    data: fetdPending,
    request: fetchPending,
    loading: lPeding,
    error: errPen,
  } = useApi(getPendingAppointments);

  const {
    data: fetdConfirmed,
    request: fetchConfirmed,
    loading: lConfirmed,
    error: errConf,
  } = useApi(getConfirmedAppointments);

  const loading = lConfirmed || lPeding;

  const refresh = async () => {
    try {
      setRefreshing(true);
      await fetchConfirmed(shopId);
      await fetchPending(shopId);
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConfirmed(shopId);
    fetchPending(shopId);
  }, []);

  useEffect(() => {
    setConfirmed(fetdConfirmed);
    setPending(fetdPending);
  }, [fetdPending, fetdConfirmed]);

  const handleTab = () => {
    if (tab === "1") setTab("2");
    else setTab("1");
  };

  const handleApproval = (id) => {
    setPending((p) => p.filter((a) => a._id !== id));
    const app = pending.find((a) => a._id === id);
    setConfirmed((p) => [{ ...app, status: "confirmed" }, ...p]);
  };

  const handleRejection = async (id) => {
    try {
      setPending((p) => p.filter((a) => a._id !== id));
      const response = await rejectAppointment(id);
    } catch (error) {}
  };

  const handleCompletion = async (id) => {
    try {
      setConfirmed((p) =>
        p.map((app) =>
          app._id === id ? { ...app, status: "completed" } : app,
        ),
      );
      const res = await markAppointmentCompleted(id);
      if (res.ok) await loadBook();
    } catch (error) {
      console.log(error);
    }
  };

  const handleNoshow = async (id) => {
    try {
      setConfirmed((p) =>
        p.map((app) => (app._id === id ? { ...app, status: "no-show" } : app)),
      );
      const response = await markAppointmentNoShow(id);
    } catch (error) {
      console.log(error);
    }
  };

  const RenderAppointments =
    tab === "1"
      ? confirmed.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            id={appointment._id}
            customer={appointment?.customer}
            car={appointment.car}
            shop={appointment.shop}
            serviceParts={appointment.serviceParts}
            status={appointment.status}
            scheuledAt={appointment.scheduledDate}
            onComplete={handleCompletion}
            onNoShow={handleNoshow}
            type={"1"}
          />
        ))
      : pending.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            id={appointment._id}
            customer={appointment?.customer}
            car={appointment.car}
            shop={appointment.shop}
            serviceParts={appointment.serviceParts}
            status={appointment.status}
            scheuledAt={appointment.scheduledDate}
            type={"2"}
            onReject={handleRejection}
            onAccept={handleApproval}
          />
        ));

  return (
    <SafeScreen>
      <ScrollScreen
        {...(Platform.OS !== "web" && { refreshing, onRefresh: refresh })}
        stickyHeader
        stickyHeaderIndices={[0]}
      >
        <TabNav
          one={"Confirmed"}
          two={"Pending"}
          active={tab}
          onTabChange={handleTab}
        />
        <GapContainer>
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
          {RenderAppointments.length === 0 && !loading ? (
            <SText
              thin
              color={"sec_text"}
              style={{ margin: "auto", textAlign: "center" }}
            >
              No appointments here
            </SText>
          ) : (
            RenderAppointments
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

export default ShopAppointments;

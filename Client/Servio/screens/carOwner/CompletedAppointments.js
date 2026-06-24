import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import Navbar from "../../components/general/Navbar";
import GapContainer from "../../components/general/GapContainer";
import { useEffect, useState } from "react";
import { UseAppointment } from "../../context/AppointmentContext";
import MenuBackBtn from "../../components/general/MenuBackBtn";
import { useNavigation } from "@react-navigation/native";
import AppointmentCard from "../../components/cards/AppointmentCard";
import RatingModal from "../../components/rating/RatingModal";
import SText from "../../components/text/SText";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import ReportModal from "../../components/form/ReportModal";
import { Platform } from "react-native";
import { UseUser } from "../../context/UserContext";
import useApi from "../../hooks/useApi";
import { getCallToAction } from "../../api/appointment";
import { useBookingStore } from "../../store/shopOwner/useBookingsStore";

function CompletedAppointmets(props) {
  const { isUser, isShopOwner } = UseUser();
  const {
    fetchCompleted,
    completed,
    setCompleted,
    loading: loadingUserAppointments,
  } = UseAppointment();
  const { callTo, loadBook, loading: loadingCallTo } = useBookingStore();

  const [refreshing, setRefreshing] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [ratingData, setRatingData] = useState(null);
  const [reportModal, setReportModal] = useState(false);
  const [reportId, setReportId] = useState(null);
  const navigate = useNavigation();

  const loading = loadingUserAppointments || loadingCallTo;

  const refresh = async () => {
    try {
      setRefreshing(true);
      if (isUser) await fetchCompleted();
      else await loadBook();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const handleRating = async (data) => {
    setShowRating(true);
    setRatingData(data);
  };

  const handleReport = async (appId) => {
    setReportModal(true);
    setReportId(appId);
  };

  const dataSource = isUser ? completed : callTo;

  const completedList =
    dataSource.length > 0 ? (
      dataSource?.map((appointment) => (
        <AppointmentCard
          key={appointment._id}
          id={appointment._id}
          customer={appointment?.customer}
          car={appointment.car}
          shop={appointment.shop}
          serviceParts={appointment.serviceParts}
          status={appointment.status}
          scheuledAt={appointment.scheduledDate}
          {...(isUser && { showRateAndReport: true })}
          openRatingModal={handleRating}
          openReportModal={handleReport}
          isReported={appointment.isReported}
        />
      ))
    ) : (
      <SText
        thin
        color={"sec_text"}
        style={{ marginHorizontal: "auto", textAlign: "center" }}
      >
        You're all caught up!
      </SText>
    );

  return (
    <SafeScreen>
      <ScrollScreen
        {...(Platform.OS !== "web" && { refreshing, onRefresh: refresh })}
      >
        <MenuBackBtn onClose={() => navigate.goBack()} />
        <GapContainer>
          {completedList}
          {loading && (
            <GapContainer>
              <LoadingSkeleton />
              <LoadingSkeleton />
            </GapContainer>
          )}
        </GapContainer>
      </ScrollScreen>
      <RatingModal
        isVisible={showRating}
        onClose={() => setShowRating(false)}
        appointmentId={ratingData?.appointmentId}
        shopId={ratingData?.shopId}
        setRatingData={setRatingData}
      />
      <ReportModal
        visible={reportModal}
        onClose={() => setReportModal(false)}
        appointmentId={reportId}
        setReportId={setReportId}
      />
      <Navbar />
    </SafeScreen>
  );
}

export default CompletedAppointmets;

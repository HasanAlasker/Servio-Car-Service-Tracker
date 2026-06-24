import { StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import GapContainer from "../../components/general/GapContainer";
import KeyboardScrollScreen from "../../components/general/KeyboardScrollScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import AppForm from "../../components/form/AppForm";
import * as Yup from "yup";
import FormikDatePicker from "../../components/form/FormikDatePicker";
import SubmitBtn from "../../components/form/SubmitBtn";
import { useRef, useState } from "react";
import AppSummary from "../../components/cards/AppSummary";
import { bookAppointment } from "../../api/appointment";
import { getSlots } from "../../api/slots";
import ErrorMessage from "../../components/form/ErrorMessage";
import { UseAppointment } from "../../context/AppointmentContext";
import useAppToast from "../../hooks/useAppToast";
import MenuBackBtn from "../../components/general/MenuBackBtn";
import BackContainer from "../../components/general/BackContainer";
import PriBtn from "../../components/general/PriBtn";
import NavCont from "../../components/navbars/NavCont";
import TimeSlot from "../../components/cards/TimeSlot";
import useApi from "../../hooks/useApi";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import Animated, {
  LinearTransition,
  SlideInDown,
} from "react-native-reanimated";
import ScrollScreen from "../../components/general/ScrollScreen";

const validationSchema = Yup.object({
  date: Yup.date()
    .required("Please select a date")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Date cannot be in the past",
    ),
});

function MakeAppointment(props) {
  const submitRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loadAppointments } = UseAppointment();
  const toast = useAppToast();

  const [hasBeenSubmited, setHasBeenSubmited] = useState(false);
  const [err, setErr] = useState(null);
  const [from, setFrom] = useState(null);

  const navigate = useNavigation();
  const route = useRoute();
  const params = route.params;

  const { data: slots, request: fetchSlots, loading, error } = useApi(getSlots);

  const handleSlotPress = async (fromSlot) => {
    if (from === fromSlot) {
      return setFrom(null);
    }
    setFrom(fromSlot);
  };

  const RenderSlots = slots
    ? slots.slots?.map((slot) => (
        <TimeSlot
          key={slot?.from}
          from={slot?.from}
          to={slot?.to}
          isBusy={slot?.isBusy}
          onPress={handleSlotPress}
          selected={from}
        />
      ))
    : null;

  const initialValues = {
    date: "",
  };

  let partsId = route.params.parts.map((part) => part._id);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    let dateObj = new Date(values.date);
    const [hours, minutes] = from.split(":");
    dateObj.setHours(parseInt(hours, 10));
    dateObj.setMinutes(parseInt(minutes, 10));
    dateObj.setSeconds(0);
    dateObj.setMilliseconds(0);

    let date = dateObj.toISOString();

    try {
      const appointmentData = {
        car: params.car._id,
        shop: params.shop.id,
        serviceParts: partsId,
        scheduledDate: date,
        time: from,
      };

      const response = await bookAppointment(appointmentData);

      if (response.ok) {
        await loadAppointments();
        navigate.navigate("Bookings", { active: "1", celebrate: true });
        toast.success("Booked!");
      } else if (
        !response.ok &&
        response.data.errors[0].message ===
          "Scheduled date cannot be in the past"
      ) {
        toast.error("Time has passed");
      } else {
        setErr("This car has another appointment in this time");
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      setErr("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefClick = () => {
    setHasBeenSubmited(true);
    try {
      submitRef.current?.();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeScreen>
      <ScrollScreen style={{ width: "100%" }}>
        <BackContainer style={styles.back}>
          <MenuBackBtn
            onClose={() => {
              navigate.goBack();
            }}
          />
        </BackContainer>
        <GapContainer>
          <AppForm
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <GapContainer gap={15}>
                <AppSummary params={params} />

                <FormikDatePicker
                  full
                  minimumDate={new Date()}
                  name={"date"}
                  icon="calendar-outline"
                  hasBeenSubmitted={hasBeenSubmited}
                  onDateChange={(selectedDate) => {
                    setFieldValue("time", "");
                    const [date] = selectedDate.toISOString().split("T");
                    fetchSlots(params.shop.id, date);
                    setFrom(null);
                  }}
                />

                {loading && <LoadingSkeleton short />}
                {values.date && !slots.isOpen && !loading && (
                  <TimeSlot
                    isBusy={true}
                    from={"Shop is"}
                    to={"Closed"}
                    selected={false}
                  />
                )}
                {values.date && slots.isOpen && !loading && RenderSlots}

                <SubmitBtn
                  square
                  defaultText="Confirm"
                  submittingText="Confirming..."
                  setHasBeenSubmitted={setHasBeenSubmited}
                  style={{ display: "none" }}
                  submitRef={submitRef}
                />

                {err && <ErrorMessage error={err} />}
              </GapContainer>
            )}
          </AppForm>
        </GapContainer>
      </ScrollScreen>
      {from && (
        <Animated.View layout={LinearTransition} entering={SlideInDown}>
          <NavCont>
            <PriBtn
              disabled={isSubmitting}
              square
              full
              title={!isSubmitting ? `Book ${from}` : "Booking..."}
              onPress={handleRefClick}
            />
          </NavCont>
        </Animated.View>
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({});

export default MakeAppointment;

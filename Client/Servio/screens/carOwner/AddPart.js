import { StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import KeyboardScrollScreen from "../../components/general/KeyboardScrollScreen";
import Navbar from "../../components/general/Navbar";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Yup from "yup";
import AppForm from "../../components/form/AppForm";
import { useEffect, useState } from "react";
import GapContainer from "../../components/general/GapContainer";
import FormikInput from "../../components/form/FormikInput";
import SeparatorComp from "../../components/general/SeparatorComp";
import SubmitBtn from "../../components/form/SubmitBtn";
import { addPart, editPart, unTrackPart } from "../../api/part";
import ErrorMessage from "../../components/form/ErrorMessage";
import PriBtn from "../../components/general/PriBtn";
import { useTheme } from "../../context/ThemeContext";
import FormikDatePicker from "../../components/form/FormikDatePicker";
import { UseService } from "../../context/ServiceContext";
import useAppToast from "../../hooks/useAppToast";
import MenuBackBtn from "../../components/general/MenuBackBtn";
import BackContainer from "../../components/general/BackContainer";
import { alert } from "react-native-alert-queue";
import Animated, {
  LinearTransition,
  SlideInDown,
} from "react-native-reanimated";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .lowercase()
    .min(2, "Minimum 2 characters")
    .max(20, "Maximum 20 characters")
    .required("Part name is required"),

  months: Yup.number()
    .integer("Months must be an integer")
    .min(0, "Months cannot be negative")
    .max(360, "Months cannot be more than 360")
    .required("Recommended months are required")
    .transform((value, originalValue) =>
      originalValue === "" ||
      originalValue === null ||
      originalValue === undefined
        ? null
        : value,
    )
    .typeError("Months must be a number"),

  miles: Yup.number()
    .integer("Miles must be an integer")
    .min(0, "Miles cannot be negative")
    .max(500000, "Miles cannot be more than 500,000")
    .required("Recommended miles are required")
    .transform((value, originalValue) =>
      originalValue === "" ||
      originalValue === null ||
      originalValue === undefined
        ? null
        : value,
    )
    .typeError("Miles must be a number"),

  lastChangeDate: Yup.date()
    .min(1900, "Year must be 1900 or later")
    .max(
      new Date(new Date().setHours(23, 59, 59, 999)),
      "Last change date cannot be in the future",
    )
    .required("Last change date is required")
    .typeError("Last change date must be a valid date"),

  lastChangeMileage: Yup.number()
    .integer("Mileage must be integer")
    .min(0, "Mileage cannot be negative")
    .max(1000000, "Maximum Mileage is 1,000,000")
    .required("Last change mileage is required")
    .typeError("Mileage must be a number"),

  note: Yup.string()
    .trim()
    .min(2)
    .max(100)
    .matches(
      /^[a-zA-Z0-9\s'-]+$/,
      "Note can only contain letters, numbers, spaces, hyphens, and apostrophes",
    )
    .notRequired(),
});

function AddPart(props) {
  const { theme } = useTheme();
  const { loadServices } = UseService();
  const [hasBeenSubmitted, setHasBeenSubmited] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [isEdit, setEdit] = useState(false);
  const toast = useAppToast();

  const navigate = useNavigation();
  const route = useRoute();
  const params = route?.params;

  const initialValues = {
    name: params?.passPart?.partName || "",
    lastChangeDate: params?.passPart?.lastChangeDate || "",
    lastChangeMileage: params?.passPart?.lastChangeMileage?.toString() || "",
    months:
      params?.passPart?.recommendedChangeInterval?.months?.toString() || null,
    miles:
      params?.passPart?.recommendedChangeInterval?.miles?.toString() || null,
    note: params?.passPart?.note || "",
  };

  useEffect(() => {
    if (params?.passPart?.isEdit) {
      setEdit(true);
    }
  }, [params]);

  const handleSubmit = async (values) => {
    const data = {
      name: values.name,
      lastChangeDate: values.lastChangeDate,
      lastChangeMileage: Number(values.lastChangeMileage),
      recommendedChangeInterval: {
        months: Number(values.months),
        miles: Number(values.miles),
      },
      note: values.note,
    };
    try {
      const response = await addPart(params?.id, data);
      if (response.ok) {
        await loadServices();
        navigate.navigate("CarParts", params);
        toast.success("Part Added!");
      }
      if (!response.ok) {
        setErrMsg(response.data.errors.map((e) => e.message).join(", "));
      }
    } catch (error) {}
  };

  const handleEdit = async (values) => {
    const data = {
      name: values.name,
      lastChangeDate: values.lastChangeDate,
      lastChangeMileage: Number(values.lastChangeMileage),
      recommendedChangeInterval: {
        months: Number(values.months),
        miles: Number(values.miles),
      },
      note: values?.note,
    };
    try {
      const response = await editPart(params?.passPart.partId, data);
      if (response.ok) {
        await loadServices();
        navigate.navigate("CarParts", params?.parentParams);
        toast.success("Part Updated!");
      }
      if (!response.ok) {
        setErrMsg(response.data.errors.map((e) => e.message).join(", "));
      }
    } catch (error) {}
  };

  const handleDelete = async (values) => {
    try {
      const confirmed = await alert.confirm();
      if (confirmed) {
        const response = await unTrackPart(params?.passPart.partId);
        if (response.ok) {
          await loadServices();
          navigate.navigate("CarParts", params?.parentParams);
          toast.success("Part Deleted!");
        }
        if (!response.ok) {
          setErrMsg(response.data.errors.map((e) => e.message).join(", "));
        }
      }
    } catch (error) {}
  };

  return (
    <SafeScreen>
      <KeyboardScrollScreen>
        <BackContainer>
          <MenuBackBtn onClose={() => navigate.goBack()} />
        </BackContainer>
        <AppForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={!isEdit ? handleSubmit : handleEdit}
        >
          <GapContainer gap={15}>
            <FormikInput
              name={"name"}
              placeholder={"Part Name"}
              icon={"engine-outline"}
              hasBeenSubmitted={hasBeenSubmitted}
            />

            <FormikDatePicker
              full
              name={"lastChangeDate"}
              placeholder="Last change date"
              hasBeenSubmitted={hasBeenSubmitted}
            />

            <FormikInput
              name={"lastChangeMileage"}
              placeholder={"Last change mileage"}
              icon={"gauge"}
              hasBeenSubmitted={hasBeenSubmitted}
            />
            <Animated.View layout={LinearTransition} entering={SlideInDown}>
              <SeparatorComp children={"Recommended change after"} />
            </Animated.View>

            <FormikInput
              name={"months"}
              placeholder={"Months"}
              icon={"calendar-outline"}
              hasBeenSubmitted={hasBeenSubmitted}
            />

            <FormikInput
              name={"miles"}
              placeholder={"Miles/ Kilometers"}
              icon={"skip-next-circle-outline"}
              hasBeenSubmitted={hasBeenSubmitted}
            />

            <FormikInput
              name={"note"}
              placeholder={"Note (Optional)"}
              isBox
              height={100}
              icon={"note-outline"}
              hasBeenSubmitted={hasBeenSubmitted}
            />

            {errMsg && <ErrorMessage error={errMsg} />}

            <SubmitBtn
              square
              defaultText={!isEdit ? "Add Part" : "Edit Part"}
              submittingText={!isEdit ? "Adding Part..." : "Editing Part..."}
              setHasBeenSubmitted={setHasBeenSubmited}
            />
            {isEdit && (
              <PriBtn
                red
                square
                title={"Delete Part"}
                onPress={handleDelete}
                disabled={hasBeenSubmitted}
              />
            )}
          </GapContainer>
        </AppForm>
      </KeyboardScrollScreen>
      <Navbar />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AddPart;

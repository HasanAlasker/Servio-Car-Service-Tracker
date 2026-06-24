import { StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import Navbar from "../../components/general/Navbar";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import KeyboardScrollScreen from "../../components/general/KeyboardScrollScreen";
import AppForm from "../../components/form/AppForm";
import AddImageBtn from "../../components/form/AddImageBtn";
import FormikInput from "../../components/form/FormikInput";
import GapContainer from "../../components/general/GapContainer";
import SubmitBtn from "../../components/form/SubmitBtn";
import OpenHoursInput from "../../components/form/OpenHoursInput";
import { deleteShop, editShop, openShop } from "../../api/shop";
import { useNavigation, useRoute } from "@react-navigation/native";
import ErrorMessage from "../../components/form/ErrorMessage";
import { formatServices, revertServices } from "../../functions/formatServices";
import { UseShop } from "../../context/ShopContext";
import PriBtn from "../../components/general/PriBtn";
import useThemedStyles from "../../hooks/useThemedStyles";
import { UseUser } from "../../context/UserContext";
import { getLatLngFromGoogleMapsLink } from "../../functions/getCoordsFromLink";
import BackContainer from "../../components/general/BackContainer";
import MenuBackBtn from "../../components/general/MenuBackBtn";
import useAppToast from "../../hooks/useAppToast";
import { alert } from "react-native-alert-queue";

const validationSchema = Yup.object({
  image: Yup.string().required("Shop image is required"),
  name: Yup.string()
    .min(2)
    .max(25)
    .required("Shop name is required")
    .matches(/^[a-zA-Z\s'-]+$/)
    .trim(),
  city: Yup.string().trim().required("City is required"),
  area: Yup.string().trim().required("Area is required"),
  street: Yup.string().trim().required("Street is required"),
  phone: Yup.string()
    .required("Shop phone is required")
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/),
  description: Yup.string()
    .trim()
    .min(10)
    .max(50)
    .required("Shop description is required"),
  services: Yup.string().required("Shop services are required"),
  openHours: Yup.array()
    .of(
      Yup.object().shape({
        day: Yup.string().required(),
        dayName: Yup.string().required(),
        isOpen: Yup.boolean().required(),
        from: Yup.string().when("isOpen", {
          is: true,
          then: (schema) => schema.required("Opening time is required"),
          otherwise: (schema) => schema,
        }),
        to: Yup.string().when("isOpen", {
          is: true,
          then: (schema) => schema.required("Closing time is required"),
          otherwise: (schema) => schema,
        }),
      }),
    )
    .test(
      "at-least-one-open",
      "Shop must be open at least one day",
      (hours) => {
        return hours?.some((day) => day.isOpen);
      },
    ),
  link: Yup.string()
    .required("Link is required")
    .min(5)
    .max(500)
    .trim()
    .matches(
      /^https:\/\/(www\.)?(google\.com\/maps|maps\.google\.com|goo\.gl\/maps|maps\.app\.goo\.gl)/,
      "Must be a valid Google Maps link",
    ),
});

const formatValues = (values) => {
  const { city, area, street, ...rest } = values;

  return {
    ...rest,
    services: formatServices(values.services),
    address: { city, area, street },
  };
};

function AddShop(props) {
  const { isUser, isShopOwner } = UseUser();
  const styles = useThemedStyles(getStyles);
  const { loadShops } = UseShop();
  const [hasBeenSubmitted, setHasbeenSubmitted] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const toast = useAppToast();

  const navigate = useNavigation();
  const route = useRoute();
  const params = route?.params;

  useEffect(() => {
    if (params) setEdit(true);
  }, []);

  const handleSubmit = async (values) => {
    setErr(false);
    setErrMsg(null);

    const coords = await getLatLngFromGoogleMapsLink(values.link);

    const formattedValues = {
      ...formatValues(values),
      lat: coords?.lat,
      lng: coords?.lng,
    };

    try {
      const response = await openShop(formattedValues);
      if (response.ok) {
        await loadShops();
        if (isUser) navigate.navigate("Home");
        if (isShopOwner) navigate.navigate("MyShop");
        toast.success("Sent!");
      }
      if (!response.ok) {
        setErr(true);
        if (response.data?.message === "Validation error") {
          setErrMsg(response.data.errors.map((e) => e.message).join(", "));
        } else {
          setErrMsg("An error occurred. Please try again.");
        }
        toast.error("Error!");
      }
    } catch (error) {}
  };

  const handleEdit = async (values) => {
    setErr(false);
    setErrMsg(null);

    const coords = await getLatLngFromGoogleMapsLink(values.link);
    console.log(coords)

    const formattedValues = {
      ...formatValues(values),
      lat: coords?.lat,
      lng: coords?.lng,
    };

    try {
      const response = await editShop(params._id, formattedValues);
      if (response.ok) {
        await loadShops();
        if (isUser) navigate.navigate("Home");
        if (isShopOwner) navigate.navigate("MyShop");
      } else {
        setErr(true);
        if (response.data?.message === "Validation error") {
          setErrMsg(response.data.errors.map((e) => e.message).join(", "));
        } else {
          setErrMsg("An error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error(error);
      setErr(true);
      setErrMsg("An error occurred. Please try again.");
    }
  };
  const handleDelete = async (values) => {
    setErr(false);
    setErrMsg(null);

    try {
      const confirmed = await alert.confirm();
      if (confirmed) {
        const response = await deleteShop(params._id);
        if (response.ok) {
          await loadShops();
          if (isUser) navigate.navigate("Home");
          if (isShopOwner) navigate.navigate("ShopDash");
        }
        if (!response.ok) {
          setErr(true);
          setErrMsg(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues = {
    image: params?.image || "",
    name: params?.name || "",
    description: params?.description || "",
    city: params?.address?.city || "",
    area: params?.address?.area || "",
    street: params?.address?.street || "",
    services: revertServices(params?.services) || "",
    openHours: [
      {
        day: "sun",
        dayName: "Sunday",
        isOpen: params?.openHours[0].isOpen || true,
        from: params?.openHours[0].from || "09:00",
        to: params?.openHours[0].to || "18:00",
      },
      {
        day: "mon",
        dayName: "Monday",
        isOpen: params?.openHours[1].isOpen || true,
        from: params?.openHours[1].from || "09:00",
        to: params?.openHours[1].to || "18:00",
      },
      {
        day: "tue",
        dayName: "Tuesday",
        isOpen: params?.openHours[2].isOpen || true,
        from: params?.openHours[2].from || "09:00",
        to: params?.openHours[2].to || "18:00",
      },
      {
        day: "wed",
        dayName: "Wednesday",
        isOpen: params?.openHours[3].isOpen || true,
        from: params?.openHours[3].from || "09:00",
        to: params?.openHours[3].to || "18:00",
      },
      {
        day: "thu",
        dayName: "Thursday",
        isOpen: params?.openHours[4].isOpen || true,
        from: params?.openHours[4].from || "09:00",
        to: params?.openHours[4].to || "18:00",
      },
      {
        day: "fri",
        dayName: "Friday",
        isOpen: params?.openHours[5].isOpen || false,
        from: params?.openHours[5].from || "",
        to: params?.openHours[5].to || "",
      },
      {
        day: "sat",
        dayName: "Saturday",
        isOpen: params?.openHours[6].isOpen || false,
        from: params?.openHours[6].from || "",
        to: params?.openHours[6].to || "",
      },
    ],
    phone: params?.phone || "",
    link: params?.link || "",
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
          {({ values, errors, setFieldValue, setStatus }) => (
            <GapContainer gap={15}>
              <AddImageBtn
                image={values.image}
                onImageChange={(imageUri) => {
                  setFieldValue("image", imageUri);
                  setStatus(null);
                }}
                error={hasBeenSubmitted && errors.image}
                errorMessage={errors.image}
              />

              <FormikInput
                name={"name"}
                placeholder={"Shop name"}
                icon={"store-outline"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"city"}
                placeholder={"City"}
                icon={"city"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"area"}
                placeholder={"Area"}
                icon={"map-marker-radius-outline"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"street"}
                placeholder={"Street"}
                icon={"road-variant"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"phone"}
                placeholder={"Shop phone"}
                icon={"phone-outline"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"link"}
                placeholder={"Google maps Link"}
                icon={"link"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"description"}
                placeholder={"Shop description"}
                isBox
                height={80}
                icon={"comment-text-outline"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"services"}
                placeholder={"Shop services, (car accessories, oil changes)"}
                isBox
                height={80}
                icon={"wrench-outline"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <OpenHoursInput
                name="openHours"
                hasBeenSubmitted={hasBeenSubmitted}
              />
              {err && <ErrorMessage error={errMsg} />}
              <SubmitBtn
                square
                defaultText={!isEdit ? "Send Request" : "Edit Shop"}
                submittingText={!isEdit ? "Sending..." : "Editing..."}
                setHasBeenSubmitted={setHasbeenSubmitted}
              />

              {isEdit && (
                <PriBtn
                  square
                  title={"Delete Shop"}
                  red
                  disabled={hasBeenSubmitted}
                  onPress={handleDelete}
                />
              )}
            </GapContainer>
          )}
        </AppForm>
      </KeyboardScrollScreen>
      <Navbar />
    </SafeScreen>
  );
}

const getStyles = (theme) => StyleSheet.create({});

export default AddShop;

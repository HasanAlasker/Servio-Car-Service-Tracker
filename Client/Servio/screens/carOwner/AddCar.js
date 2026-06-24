import { StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import Navbar from "../../components/general/Navbar";
import * as Yup from "yup";
import AppForm from "../../components/form/AppForm";
import KeyboardScrollScreen from "../../components/general/KeyboardScrollScreen";
import FormikInput from "../../components/form/FormikInput";
import GapContainer from "../../components/general/GapContainer";
import { useEffect, useState } from "react";
import SubmitBtn from "../../components/form/SubmitBtn";
import AddImageBtn from "../../components/form/AddImageBtn";
import FormikDropBox from "../../components/form/FormikDropBox";
import { addCar, editCar, getMakeAndModels } from "../../api/car";
import useApi from "../../hooks/useApi";
import { capFirstLetter } from "../../functions/CapFirstLetterOfWord";
import { useNavigation, useRoute } from "@react-navigation/native";
import useThemedStyles from "../../hooks/useThemedStyles";
import { UseCar } from "../../context/CarContext";
import { unitTypes } from "../../constants/dropList";
import ErrorMessage from "../../components/form/ErrorMessage";
import useAppToast from "../../hooks/useAppToast";
import BackContainer from "../../components/general/BackContainer";
import MenuBackBtn from "../../components/general/MenuBackBtn";

export const validationSchema = Yup.object({
  make: Yup.string().trim().required("Car make is required"),

  name: Yup.string().trim().required("Car model name is required"),

  image: Yup.string().required("Image is required"),

  model: Yup.number()
    .integer("Year must be a whole number")
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future")
    .required("Year is required")
    .typeError("Year must be a number"),

  color: Yup.string()
    .trim()
    .min(2, "Minimum 2 characters")
    .max(15, "Maximum 15 characters")
    .required("Color is required"),

  plateNumber: Yup.string()
    .trim()
    .min(1, "Minimum 1 character")
    .max(10, "Maximum 10 characters")
    .required("Plate number is required"),

  mileage: Yup.number()
    .integer("Mileage must be integer")
    .min(0, "Mileage cannot be negative")
    .max(1000000, "Mileage cannot be greater than 1,000,000")
    .required("Mileage is required")
    .typeError("Mileage must be a number"),

  unit: Yup.string()
    .oneOf(["km", "mile"])
    .required("Odometer unit is required"),
});

function AddCar(props) {
  const styles = useThemedStyles(getStyles);
  const { addNewCar, updateCars, cars: contextCars } = UseCar();
  const toast = useAppToast();

  const [hasBeenSubmitted, setHasBeenSubmited] = useState(false);
  const [cars, setCars] = useState([]);
  const [selectedMake, setSelectedMake] = useState(null);
  const [namesList, setNamesList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErr, setValidationErr] = useState(null);

  const navigate = useNavigation();
  const route = useRoute();

  const params = route?.params;
  useEffect(() => {
    if (params) {
      setIsEdit(true);
      setSelectedMake(params.make);
    }
  }, []);

  const car = contextCars.find((c) => c._id === params?.id);

  const initialValues = {
    make: car?.make || "",
    name: car?.name || "",
    model: car?.model?.toString() || "",
    color: car?.color || "",
    plateNumber: car?.plateNumber || "",
    mileage: car?.mileage?.toString() || "",
    unit: car?.unit || "",
    image: car?.image || "",
  };

  const {
    data: fetchedCars,
    request: fetchCars,
    loading,
    error,
  } = useApi(getMakeAndModels);

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    setCars(fetchedCars);
  }, [fetchedCars]);

  const makesList = cars.map((car) => ({
    label: capFirstLetter(car.make),
    value: car.make,
  }));

  const getCarNames = () => {
    let selectedCar = cars.find((car) => car.make === selectedMake);
    const namesList = selectedCar?.name;
    if (selectedCar && namesList) {
      const list = namesList.map((name) => ({
        label: capFirstLetter(name),
        value: name,
      }));
      setNamesList(list);
    }
  };

  useEffect(() => {
    if (selectedMake) {
      getCarNames();
    } else {
      setNamesList([]);
    }
  }, [selectedMake, cars]);

  const handleSubmit = async (values) => {
    setValidationErr(null);
    setIsSubmitting(true);
    try {
      const response = await addCar(values);
      if (response.data?.message === "Validation error") {
        setValidationErr(response.data.errors[0].message);
      }

      if (response.ok) {
        const newCar = response.data.data;
        addNewCar(newCar);
        const passCar = {
          id: newCar._id,
          make: newCar.make,
          name: newCar.name,
          mileage: newCar.mileage,
          unit: newCar.unit,
        };
        navigate.navigate("CarParts", passCar);
        toast.success("Add a part!");
      }
      if (!response.ok) toast.error("Image too big");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (values) => {
    setIsSubmitting(true);
    setValidationErr(null);
    try {
      const response = await editCar(params.id, values);
      if (response.data?.message === "Validation error") {
        setValidationErr(response.data.errors[0].message);
      }

      if (response.ok) {
        updateCars(response.data.data);
        navigate.navigate("CarParts", params);
      }
      if (!response.ok) toast.error("Image too big");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
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

              <FormikDropBox
                name={"make"}
                placeholder={"Make"}
                items={makesList}
                icon={"home-city-outline"}
                hasBeenSubmitted={hasBeenSubmitted}
                onSelectItem={(value) => {
                  setSelectedMake(value);
                  setFieldValue("make", value);
                  // Reset model when make changes
                  setFieldValue("name", "");
                }}
              />

              {selectedMake && (
                <FormikDropBox
                  name={"name"}
                  placeholder={"Name"}
                  items={namesList}
                  icon={"car-lifted-pickup"}
                  hasBeenSubmitted={hasBeenSubmitted}
                  onSelectItem={(value) => {
                    setFieldValue("name", value);
                  }}
                />
              )}

              <FormikInput
                name={"model"}
                lable={"Model"}
                placeholder={"Model (Year of make)"}
                icon={"timer-cog-outline"}
                autoCapitalize={"none"}
                keyboardType={"numeric"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"plateNumber"}
                placeholder={"Plate number"}
                icon={"newspaper-variant-outline"}
                autoCapitalize={"none"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"mileage"}
                lable={"Odometer"}
                placeholder={"Mileage (Odometer)"}
                icon={"gauge"}
                autoCapitalize={"none"}
                keyboardType={"numeric"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikDropBox
                name={"unit"}
                placeholder={"Odometer unit"}
                items={unitTypes}
                icon={"beaker-outline"}
                hasBeenSubmitted={hasBeenSubmitted}
                onSelectItem={(value) => {
                  setFieldValue("unit", value);
                }}
              />

              <FormikInput
                name={"color"}
                placeholder={"Color"}
                icon={"palette-outline"}
                autoCapitalize={"none"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              {validationErr && <ErrorMessage error={validationErr} />}

              <SubmitBtn
                square
                defaultText={!isEdit ? "Add Car" : "Edit Car"}
                submittingText={!isEdit ? "Adding Car..." : "Editing Car..."}
                disabled={loading}
                setHasBeenSubmitted={setHasBeenSubmited}
              />
            </GapContainer>
          )}
        </AppForm>
      </KeyboardScrollScreen>
      <Navbar />
    </SafeScreen>
  );
}

const getStyles = (theme) => StyleSheet.create({});

export default AddCar;

import { StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import Navbar from "../../components/general/Navbar";
import KeyboardScrollScreen from "../../components/general/KeyboardScrollScreen";
import * as Yup from "yup";
import AppForm from "../../components/form/AppForm";
import { UseUser } from "../../context/UserContext";
import GapContainer from "../../components/general/GapContainer";
import FormikInput from "../../components/form/FormikInput";
import { useState } from "react";
import SeparatorComp from "../../components/general/SeparatorComp";
import SubmitBtn from "../../components/form/SubmitBtn";
import UserCard from "../../components/cards/UserCard";
import ErrorMessage from "../../components/form/ErrorMessage";
import useAppToast from "../../hooks/useAppToast";
import Animated, {
  LinearTransition,
  SlideInDown,
} from "react-native-reanimated";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(25, "Name must not exceed 25 characters")
    .matches(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    )
    .required("Name is required"),

  phone: Yup.string()
    .test(
      "phone-validation",
      "Please enter a valid phone number",
      function (value) {
        if (!value || value.trim() === "") return true;
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        const isValidFormat = phoneRegex.test(value);
        const isValidLength = value.length >= 10 && value.length <= 15;
        return isValidFormat && isValidLength;
      },
    )
    .required("Phone is required"),
});

function Profile(props) {
  const [hasBeenSubmitted, setHasBeenSubmited] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [err, setErr] = useState(null);
  const { user, editProfile } = UseUser();
  const toast = useAppToast();

  const initialValues = {
    name: user.name,
    phone: user.phone,
  };

  const handleEditPress = () => {
    setEdit(!isEdit);
    setErr(null);
  };

  const handleSubmit = async (values) => {
    setHasBeenSubmited(true);
    try {
      const response = await editProfile(values);
      if (response.success) {
        setEdit(false);
      }
      if (!response.success) {
        setErr(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed!");
    }
  };

  return (
    <SafeScreen gradient>
      <KeyboardScrollScreen>
        <GapContainer style={{ marginVertical: "auto" }}>
          <UserCard
            passedUser={user}
            handleEditPress={handleEditPress}
            isEdit={isEdit}
            setIsEdit={setEdit}
            short
          />
          {isEdit && (
            <AppForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <GapContainer gap={15}>
                <Animated.View layout={LinearTransition} entering={SlideInDown}>
                  <SeparatorComp children={"Edit your info"} />
                </Animated.View>

                <FormikInput
                  icon={"account-outline"}
                  name={"name"}
                  placeholder={"Name"}
                  hasBeenSubmitted={hasBeenSubmitted}
                />
                <FormikInput
                  icon={"phone-outline"}
                  name={"phone"}
                  placeholder={"Phone"}
                  hasBeenSubmitted={hasBeenSubmitted}
                />

                <SubmitBtn
                  square
                  defaultText="Save"
                  submittingText="Saving..."
                  disabled={!isEdit}
                  setHasBeenSubmitted={setHasBeenSubmited}
                />

                {err && <ErrorMessage error={err} />}
              </GapContainer>
            </AppForm>
          )}
        </GapContainer>
      </KeyboardScrollScreen>
      <Navbar />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default Profile;

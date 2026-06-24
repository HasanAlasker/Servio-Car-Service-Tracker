import { View, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import KeyboardScrollScreen from "../../components/general/KeyboardScrollScreen";
import LogoAndMoto from "../../components/welcome/LogoAndMoto";
import AppForm from "../../components/form/AppForm";
import FormikInput from "../../components/form/FormikInput";
import GapContainer from "../../components/general/GapContainer";
import SubmitBtn from "../../components/form/SubmitBtn";
import * as Yup from "yup";
import { UseUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import SeparatorComp from "../../components/general/SeparatorComp";
import SecBtn from "../../components/general/SecBtn";
import { useNavigation } from "@react-navigation/native";
import useApi from "../../hooks/useApi";
import { isServerAwake } from "../../api/upcomingService";
import ErrorMessage from "../../components/form/ErrorMessage";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .trim()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
    .matches(
      /^(?=.*[a-z])/,
      "Password must contain at least one lowercase letter",
    )
    .matches(
      /^(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter",
    )
    .matches(/^(?=.*\d)/, "Password must contain at least one number")
    .matches(
      /^(?=.*[@$!%*?&])/,
      "Password must contain at least one special character (@$!%*?&)",
    )
    .matches(/^[A-Za-z\d@$!%*?&]+$/, "Password contains invalid characters")
    .test(
      "no-common-patterns",
      "Password cannot contain common patterns",
      function (value) {
        if (!value) return true;
        const weakPatterns = [
          /(.)\1{2,}/,
          /123|234|345|456|567|678|789|890/,
          /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i,
          /qwer|asdf|zxcv|1234|admin|pass/i,
        ];
        return !weakPatterns.some((pattern) => pattern.test(value));
      },
    ),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),

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
    .required("Phone is required")
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
    ),
});

const initialValues = {
  password: "",
  email: "",
  phone: "",
  name: "",
  confirmPassword: "",
};

function Register(props) {
  const { register, error, message, loading, status } = UseUser();

  const navigation = useNavigation();

  const {
    message: connectionMsg,
    request: connectToServer,
    loading: connecting,
    error: connectionError,
    success,
    status: connectionStatus,
  } = useApi(isServerAwake);

  const [hasBeenSubmitted, setHasBeenSubmited] = useState(false);
  const [regErr, setRegErr] = useState(null);

  useEffect(() => {
    connectToServer();
  }, [hasBeenSubmitted]);

  const isButtonDisabled = loading || connecting || !success || connectionError;

  const handleSubmit = async (values, { setSubmitting }) => {
    setHasBeenSubmited(true);
    try {
      const response = await register(values);
      if (!response.success) {
        setRegErr(response.message || "Registration Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeScreen gradient>
      <KeyboardScrollScreen>
        <View style={styles.container}>
          <LogoAndMoto />
          <AppForm
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <GapContainer style={{ marginTop: "30" }} gap={15}>
              <FormikInput
                name={"name"}
                placeholder={"Name"}
                autoCapitalize={"none"}
                icon={"account-outline"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"email"}
                placeholder={"Email"}
                autoCapitalize={"none"}
                icon={"email-outline"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"phone"}
                placeholder={"Phone"}
                autoCapitalize={"none"}
                icon={"phone-outline"}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"password"}
                placeholder={"Password"}
                autoCapitalize={"none"}
                icon={"lock-outline"}
                isPassword={true}
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <FormikInput
                name={"confirmPassword"}
                placeholder={"Confirm password"}
                autoCapitalize={"none"}
                icon={"lock-outline"}
                isPassword
                hasBeenSubmitted={hasBeenSubmitted}
              />

              <SubmitBtn
                square
                disabled={isButtonDisabled}
                defaultText={
                  connecting
                    ? "Connecting..."
                    : !success
                      ? "Connection Failed"
                      : "Register"
                }
                submittingText="Registering..."
                setHasBeenSubmitted={setHasBeenSubmited}
              />

              {regErr && <ErrorMessage error={regErr} />}

              {(connectionStatus === 429 || status === 429) && (
                <ErrorMessage error={"Too many requests"} />
              )}

              <SeparatorComp children={"Or"} />

              <SecBtn
                square
                title={"Have an Account?"}
                onPress={() => navigation.navigate("Login")}
              />
            </GapContainer>
          </AppForm>
        </View>
      </KeyboardScrollScreen>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: "auto",
  },
});

export default Register;

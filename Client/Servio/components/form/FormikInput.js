import { StyleSheet, View } from "react-native";
import { useFormikContext } from "formik";
import ErrorMessage from "./ErrorMessage";
import InputBox from "../general/InputBox";
import Animated, {
  LinearTransition,
  SlideInDown,
} from "react-native-reanimated";

function FormikInput({
  name,
  placeholder,
  penOn = false,
  keyboardType,
  autoCapitalize,
  hasBeenSubmitted = false,
  icon,
  isBox,
  isPassword = false,
  ...other
}) {
  const { values, errors, handleBlur, handleChange } = useFormikContext();
  const shouldShowError = hasBeenSubmitted && errors[name];

  return (
    <Animated.View layout={LinearTransition} entering={SlideInDown}>
      <InputBox
        placeholder={placeholder}
        penOn={penOn}
        value={values[name]}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        icon={icon}
        isBox={isBox}
        isPassword={isPassword}
        {...other}
      />
      {shouldShowError && <ErrorMessage error={errors[name]} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default FormikInput;

import { StyleSheet, View } from "react-native";
import { useFormikContext } from "formik";
import ErrorMessage from "./ErrorMessage";
import DropBox from "../general/DropBox";
import Animated, {
  LinearTransition,
  SlideInDown,
} from "react-native-reanimated";


function FormikDropBox({
  name,
  placeholder,
  items,
  disabled = false,
  penOn = false,
  hasBeenSubmitted = false,
  icon,
  onSelectItem,
  ...other
}) {
  const { values, errors, touched, setFieldTouched, setFieldValue, setStatus } =
    useFormikContext();
  const shouldShowError = hasBeenSubmitted && errors[name];

  return (
    <Animated.View layout={LinearTransition} entering={SlideInDown}>
      <DropBox
        placeholder={placeholder}
        penOn={penOn}
        items={items}
        icon={icon}
        selectedValue={values[name]}
        onSelectItem={(value) => {
          setFieldValue(name, value);
          if (setStatus) {
            setStatus(null);
          }
          if (onSelectItem) {
            onSelectItem(value);
          }
        }}
        disabled={disabled}
        {...other}
      />
      {shouldShowError && <ErrorMessage error={errors[name]}></ErrorMessage>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default FormikDropBox;

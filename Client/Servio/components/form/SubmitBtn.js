import { StyleSheet } from "react-native";
import { useFormikContext } from "formik";
import PriBtn from "../general/PriBtn";
import Animated, { LinearTransition, SlideInDown } from "react-native-reanimated";

function SubmitBtn({
  submittingText = "Submitting...",
  defaultText = "Submit",
  setHasBeenSubmitted,
  disabled,
  style,
  submitRef,
  ...otherProps
}) {
  const { handleSubmit, isSubmitting, isValid } = useFormikContext();

  const handlePress = () => {
    setHasBeenSubmitted?.(true);
    handleSubmit();
  };

  if (submitRef) submitRef.current = handlePress;

  return (
    <Animated.View layout={LinearTransition} entering={SlideInDown}>
      <PriBtn
        title={isSubmitting ? submittingText : defaultText}
        onPress={handlePress}
        disabled={disabled || isSubmitting}
        loading={isSubmitting}
        style={style}
        {...otherProps}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SubmitBtn;

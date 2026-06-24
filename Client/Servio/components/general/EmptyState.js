import {
  View,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  action,
} from "react-native";
import LottieView from "../onboarding/LottieView";
import SText from "../text/SText";
import PriBtn from "./PriBtn";
import { useNavigation } from "@react-navigation/native";

function EmptyState({
  text,
  lottie,
  loop = false,
  animationHeight,
  moveTextUp,
  lottieStyle,
  action,
  btnText,
  navigateTo,
}) {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const flatLottieStyle = StyleSheet.flatten([
    { width: width * 0.9, maxWidth: 600, height: animationHeight || 250 },
    lottieStyle,
  ]);

  return (
    <View style={[styles.container, { height: height / 1.5 }]}>
      <LottieView
        style={flatLottieStyle}
        source={lottie}
        autoPlay
        loop={loop}
        speed={0.8}
      />
      <SText
        thin
        color={"sec_text"}
        style={{ bottom: moveTextUp || 0, textAlign: "center" }}
      >
        {text}
      </SText>
      {action && (
        <PriBtn
          auto
          styleText={{ fontSize: 15 }}
          style={{ marginTop: 40, paddingHorizontal: 16 }}
          title={btnText || "Add Car"}
          onPress={() => navigation.navigate(navigateTo || "AddCar")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EmptyState;

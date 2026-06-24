import { StyleSheet } from "react-native";
import CardLeftBorder from "./CardLeftBorder";
import Animated, {
  LinearTransition,
  SlideInDown,
} from "react-native-reanimated";

function InfoCard({ title, text, red, close, onClose }) {
  return (
    <Animated.View layout={LinearTransition} entering={SlideInDown}>
      <CardLeftBorder
        transparent
        icon={red ? "alert-outline" : "information-outline"}
        customColor={red ? "red" : "blue"}
        customTextColor={red ? "red" : "blue"}
        miniTitle={title}
        customText={text}
        status={" "}
        close={close}
        onClose={onClose}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default InfoCard;

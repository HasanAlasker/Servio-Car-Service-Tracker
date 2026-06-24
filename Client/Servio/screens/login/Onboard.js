import { View, StyleSheet, Dimensions, Animated, Platform } from "react-native";
import { useRef, useEffect } from "react";
import LottieView from "../../components/onboarding/LottieView";
// import LottieView from "lottie-react-native";
import Onboarding from "react-native-onboarding-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import PriBtn from "../../components/general/PriBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UseUser } from "../../context/UserContext";
import SafeScreen from "../../components/general/SafeScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

function Onboard() {
  const { theme, isDarkMode } = useTheme();
  const navigate = useNavigation();
  const { onBoardUser } = UseUser();
  const insets = useSafeAreaInsets();

  const isLight = !isDarkMode;

  const handleOnDone = async () => {
    await onBoardUser();
  };

  const CustomDot = ({ selected }) => {
    const animatedWidth = useRef(new Animated.Value(selected ? 20 : 8)).current;

    useEffect(() => {
      Animated.spring(animatedWidth, {
        toValue: selected ? 20 : 8,
        useNativeDriver: false,
      }).start();
    }, [selected]);

    return (
      <Animated.View
        style={{
          width: animatedWidth,
          height: 8,
          borderRadius: 4,
          backgroundColor: selected ? theme.activeDot : theme.dot,
          marginHorizontal: 3,
        }}
      />
    );
  };

  const DoneBtn = ({ title, ...props }) => (
    <PriBtn
      auto
      styleText={{ fontSize: 15 }}
      style={{ paddingHorizontal: 16 }}
      title={title || "Done"}
      {...props}
    />
  );

  const Gradient = () => (
    <LinearGradient
      colors={[
        theme.g1,
        theme.g2,
        theme.g3,
        theme.g4,
        theme.g5,
        theme.g6,
        theme.g7,
      ]}
      locations={[0, 0.11, 0.23, 0.7, 0.8, 1.0, 1.0]}
      start={{ x: 0.2, y: -0.2 }}
      end={{ x: 0.8, y: 1.0 }}
      style={StyleSheet.absoluteFill}
    />
  );

  return (
    <Onboarding
      bottomBarColor={theme.g2}
      onDone={handleOnDone}
      bottomBarHeight={80 + insets.bottom}
      showSkip={false}
      bottomBarHighlight={false}
      DotComponent={CustomDot}
      DoneButtonComponent={({ ...props }) => (
        <View style={styles.btnWrapper}>
          <DoneBtn title="Done" {...props} />
        </View>
      )}
      NextButtonComponent={({ ...props }) => (
        <View style={styles.btnWrapper}>
          <DoneBtn title="Next" {...props} />
        </View>
      )}
      dotsContainerStyles={styles.dotsContainer}
      pages={[
        {
          background: <Gradient />,
          isLight: isLight,
          image: (
            <View style={styles.imgCont}>
              <LottieView
                style={styles.lottie}
                source={require("../../assets/animations/car.json")}
                autoPlay
                loop
                speed={.6}
              />
            </View>
          ),
          title: "Add your car",
          subtitle: "Takes less than 30 seconds",
        },
        {
          background: <Gradient />,
          isLight: isLight,
          image: (
            <View style={styles.imgCont}>
              <LottieView
                style={styles.lottie}
                source={require("../../assets/animations/List.json")}
                autoPlay
                loop
                speed={.7}

              />
            </View>
          ),
          title: "Add one part",
          subtitle: "Start with engine oil, we'll track when it needs service",
        },
        {
          background: <Gradient />,
          isLight: isLight,
          image: (
            <View style={styles.imgCont}>
              <LottieView
                style={styles.lottie}
                source={require("../../assets/animations/Check.json")}
                autoPlay
                loop
                speed={.8}

              />
            </View>
          ),
          title: "We've got the rest",
          subtitle: "Get reminders before every service and book in seconds",
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  imgCont: { bottom: Platform.OS === "web" && 300 },
  lottie: {
    width: width * 0.8,
    height: 400,
  },
  dotsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 24,
    left: 0,
  },
  btnWrapper: {
    paddingRight: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Onboard;

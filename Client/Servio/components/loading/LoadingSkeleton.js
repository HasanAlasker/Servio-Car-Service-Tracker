import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useRoute } from "@react-navigation/native";
import GapContainer from "../general/GapContainer";

export default function LoadingSkeleton({ short }) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const styles = useThemedStyles(getStyles);
  const route = useRoute();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const AnimatedBox = ({ style }) => (
    <Animated.View style={[styles.skeleton, { opacity }, style]} />
  );

  return (
    <View style={[styles.container, { width: short ? "90%" : "100%" }]}>
      <GapContainer gap={35}>
        <GapContainer>
          <View style={styles.header}>
            <AnimatedBox style={styles.avatar} />
            <View style={styles.headerText}>
              <AnimatedBox style={styles.name} />
              <AnimatedBox style={styles.date} />
            </View>
          </View>
          <View style={styles.header}>
            <AnimatedBox style={styles.avatar} />
            <View style={styles.headerText}>
              <AnimatedBox style={styles.name} />
              <AnimatedBox style={styles.date} />
            </View>
          </View>
        </GapContainer>
        <View
          style={[
            styles.box,
            { gap: route.name === "AdminSuggestions" ? 20 : 0 },
            { marginTop: route.name === "AdminSuggestions" ? 10 : 0 },
          ]}
        >
          {/* Location */}
          <View style={styles.infoRow}>
            <AnimatedBox style={styles.iconCircle} />
            <AnimatedBox style={styles.infoText} />
          </View>
          {/* Rating */}
          <View style={styles.infoRow}>
            <AnimatedBox style={styles.iconCircle} />
            <AnimatedBox style={styles.infoTextShort} />
            <AnimatedBox style={styles.star} />
            <AnimatedBox style={styles.status} />
          </View>
        </View>
      </GapContainer>

      {/* <AnimatedBox style={styles.disableButton} /> */}
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 15,

      backgroundColor: theme.post,
      marginHorizontal: "auto",
      rowGap: 20,
      boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.14)",
    },
    box: {
      display: "flex",
      flexDirection: "column",
    },
    skeleton: {
      backgroundColor: theme.loading,
      borderRadius: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 40,
      aspectRatio: 1,
      borderRadius: 10,
    },
    headerText: {
      flex: 1,
      marginLeft: 12,
    },
    name: {
      width: 120,
      height: 16,
      marginBottom: 6,
    },
    date: {
      width: 80,
      height: 12,
    },
    menuDots: {
      width: 10,
      height: 30,
      borderRadius: 4,
    },
    messageLine1: {
      width: "70%",
      height: 14,
    },
    messageLine2: {
      width: "90%",
      height: 14,
    },
    image: {
      width: "100%",
      aspectRatio: 4 / 4,
      marginBottom: 4,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 12,
    },
    button: {
      flex: 1,
      height: 44,
      borderRadius: 22,
    },
    buttonSmall: {
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    title: {
      width: 200,
      height: 20,
      marginBottom: 12,
    },
    categoryRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 26,
    },
    category: {
      width: 80,
      height: 14,
    },
    status: {
      width: 40,
      height: 14,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      gap: 8,
    },
    iconCircle: {
      width: 16,
      height: 16,
      borderRadius: 8,
    },
    smallIconCircle: {
      width: 8,
      height: 8,
      borderRadius: 8,
      marginHorizontal: 5,
    },
    infoText: {
      width: 140,
      height: 14,
    },
    infoTextShort: {
      width: 80,
      height: 14,
    },
    star: {
      width: 16,
      height: 16,
      borderRadius: 2,
    },
    disableButton: {
      width: "100%",
      height: 38,
      borderRadius: 14,
    },
  });

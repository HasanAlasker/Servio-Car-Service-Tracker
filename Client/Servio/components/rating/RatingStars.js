import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";
import AppText from "../../config/AppText";
import SText from "../text/SText";
import TText from "../text/TText";

function RatingStars({ onRatingChange, title, subtitle }) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();

  const [rating, setRating] = useState(0);

  const handleStarPress = (starNumber) => {
    setRating(starNumber);
   
    if (onRatingChange) {
      onRatingChange(starNumber);
    }
  };

  const getRatingDescription = (rating) => {
    const descriptions = {
      0: "( No rating )",
      1: "( Terrible )",
      2: "( Not great )", 
      3: "( Average )",
      4: "( Very Good )",
      5: "( Amazing )"
    };
    return descriptions[rating] || "No rating";
  };

  return (
    <View style={styles.ratingSection}>
      <SText style={styles.text}>{title}</SText>
      {subtitle && <TText thin color={'sec_text'} style={styles.subtext}>{subtitle}</TText>}
      
      <View style={styles.container}>
        {[1, 2, 3, 4, 5].map((starNumber) => (
          <Pressable 
            key={starNumber}
            onPress={() => handleStarPress(starNumber)}
          >
            <MaterialCommunityIcons
              name={"star"}
              size={50}
              color={starNumber <= rating ? theme.gold : theme.background}
            />
          </Pressable>
        ))}
      </View>
      
      <View style={styles.display}>
        <View style={styles.row}>
          <AppText style={styles.faded}>Rating: </AppText>
          <AppText style={[styles.bold, styles.text]}>
            {rating} / 5  {getRatingDescription(rating)}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    ratingSection: {
      marginBottom: 20,
    },
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 25
    },
    row: {
      gap: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      fontSize: 20,
      color: theme.main_text,
    },
    subtext: {
      fontSize: 16,
      color: theme.darker_gray,
      marginTop: 10,
      
    },
    display: {
      width: "100%",
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 10,
      gap: 10,
      marginTop: 30,
    },
    faded: {
      color: theme.darker_gray,
      fontSize: 20,
    },
    bold:{
      fontWeight:'bold'
    }
  });

export default RatingStars;
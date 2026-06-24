import { View, StyleSheet, Image } from "react-native";
import CardComp from "./CardComp";
import MText from "../text/MText";
import SText from "../text/SText";
import RowCont from "../general/RowCont";
import { capFirstLetter } from "../../functions/CapFirstLetterOfWord";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import GapContainer from "../general/GapContainer";

function CarCard({
  id,
  image,
  make,
  name,
  model,
  plateNumber,
  color,
  mileage,
  unit,
  onPress,
}) {
  const navigate = useNavigation();
  const { theme } = useTheme();

  const passToEdit = {
    id,
    image,
    make,
    name,
    model,
    plateNumber,
    color,
    mileage,
    unit,
  };

  return (
    <CardComp
      style={styles.container}
      onPress={() => {
        !onPress ? navigate.navigate("CarParts", passToEdit) : onPress(id);
      }}
    >
      {image && <Image style={styles.image} source={{ uri: image }} />}
      <View style={styles.textCont}>
        <RowCont style={{ justifyContent: "space-between" }}>
          <GapContainer gap={3} flex>
            <RowCont>
              <MText>{capFirstLetter(make)}</MText>
              <MText flex numberOfLines={1}>
                {capFirstLetter(name)}
              </MText>
            </RowCont>
            <RowCont>
              <SText thin color={"sec_text"}>
                {plateNumber}
              </SText>
              <SText color={"sec_text"}>{"\u2022"}</SText>
              <SText thin color={"sec_text"}>
                {capFirstLetter(color)}
              </SText>
            </RowCont>
          </GapContainer>

          <Feather
            name="chevron-right"
            color={theme.sec_text}
            size={25}
            style={{ alignSelf: "flex-start", top: 5 }}
          />
        </RowCont>
      </View>
    </CardComp>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    overflow: "hidden",
  },
  textCont: {
    paddingHorizontal: 22,
    paddingVertical: 25,
  },
  image: {
    width: "100%",
    aspectRatio: 31 / 20,
    objectFit: "cover",
  },
});

export default CarCard;

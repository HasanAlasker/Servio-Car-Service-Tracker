import { View, StyleSheet, Image } from "react-native";
import CardComp from "./CardComp";
import MText from "../text/MText";
import SText from "../text/SText";
import { capFirstLetter } from "../../functions/CapFirstLetterOfWord";
import { useNavigation, useRoute } from "@react-navigation/native";
import GapContainer from "../general/GapContainer";
import CardLeftBorder from "./CardLeftBorder";
import PriBtn from "../general/PriBtn";
import { useEffect, useState } from "react";
import {
  formatDayRange,
  formatOpenDays,
} from "../../functions/formatOpenHours";
import { useTheme } from "../../context/ThemeContext";
import RowCont from "../general/RowCont";
import { Feather, Octicons } from "@expo/vector-icons";
import { UseUser } from "../../context/UserContext";
import SimpleTitleText from "../general/SimpleTitleText";
import useThemedStyles from "../../hooks/useThemedStyles";
import TText from "../text/TText";
import { useShopStore } from "../../store/admin/useShopStore";
import GhostBtn from "../general/GhostBtn";
import SeparatorComp from "../general/SeparatorComp";
import VerticalLine from "../general/VerticalLine";

function ShopCard({
  id,
  image,
  name,
  description,
  services,
  address,
  openHours,
  rating,
  ratingCount,
  isVerified = null,
  isDeleted = null,
  onAction,
  onVerify,
  onDelete,
  onCardPress,
  mini,
  serviceData,
  activeTab,
}) {
  const { theme } = useTheme();
  const styles = useThemedStyles(getStyles);
  const { isShopOwner } = UseUser();
  const [showBtn, setShowBtn] = useState(false);
  const navigate = useNavigation();

  const deleteShopA = useShopStore((state) => state.deleteShopA);
  const verifyShopA = useShopStore((state) => state.verifyShopA);

  const route = useRoute();
  const shopData = { id, name };

  const params = {
    shop: shopData,
    car: serviceData?.car,
    customer: serviceData?.customer,
    parts: serviceData?.parts,
    showBtn: route?.params?.showBtn,
  };

  useEffect(() => {
    if (params?.showBtn) setShowBtn(params?.showBtn);
  }, []);

  const days = openHours.filter((day) => day.isOpen === true);
  const groupDays = formatOpenDays(days);

  const hadlePress = (type) => {
    onAction(type, id);
  };


  return (
    <CardComp style={styles.container} onPress={onCardPress}>
      <View style={styles.imageCont}>
        {image && <Image style={styles.image} source={{ uri: image }} />}
        {!mini && (
          <RowCont style={styles.rating}>
            <Octicons
              name={rating ? "star-fill" : "star"}
              color={theme.always_white}
              size={15}
            />
            <RowCont>
              <TText color={"always_white"}>
                {rating ? rating.toFixed(2) : "Unrated"}
              </TText>
              {!!rating && (
                <TText thin color={"sec_text"}>
                  ({ratingCount})
                </TText>
              )}
            </RowCont>
          </RowCont>
        )}
      </View>

      <View style={styles.textCont}>
        <GapContainer>
          <RowCont style={{ justifyContent: "space-between" }}>
            <GapContainer gap={5}>
              <MText>{capFirstLetter(name)}</MText>
              <SText thin color={"sec_text"}>
                {description}
              </SText>
            </GapContainer>
            {isShopOwner && (
              <Feather
                name="chevron-right"
                color={theme.sec_text}
                size={25}
                style={{ alignSelf: "flex-start", top: 5 }}
              />
            )}
          </RowCont>

          {!mini && (
            <GapContainer gap={15}>
              <SimpleTitleText
                title={capFirstLetter(address.city)}
                text1={capFirstLetter(address.area + " " + address.street)}
              />
              {!mini && (
                <RowCont gap={5} style={{ flexWrap: "wrap" }}>
                  {groupDays.map((group, index) => (
                    <SimpleTitleText
                      key={index}
                      title={formatDayRange(group)}
                      text1={group[0].from + " - " + group[0].to}
                    />
                  ))}
                </RowCont>
              )}
            </GapContainer>
          )}

          {!mini && (
            <CardLeftBorder
              noPadding
              miniTitle={"Services"}
              customColor={"sec_text"}
              parts={services}
              status={"randomText"}
            />
          )}

          {showBtn && (
            <PriBtn
              full
              square
              title={"Reserve"}
              onPress={() => navigate.navigate("MakeAppointment", params)}
            />
          )}

          {isVerified !== null && (
            <GapContainer gap={5}>
              <SeparatorComp full color="faded" />
              <RowCont>
                {!isVerified && (
                  <GhostBtn
                    full
                    title={"Verify"}
                    onPress={() => verifyShopA(id, route.name)}
                  />
                )}
                {!isVerified && route.name !== "DeletedShops" && (
                  <VerticalLine />
                )}
                {!isDeleted && (
                  <GhostBtn
                    full
                    title={"Delete"}
                    onPress={() => deleteShopA(id, activeTab)}
                    red
                  />
                )}
              </RowCont>
            </GapContainer>
          )}
        </GapContainer>
      </View>
    </CardComp>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
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
    imageCont: {
      width: "100%",
      flex: 1,
      position: "relative",
    },
    rating: {
      backgroundColor: theme.always_black,
      paddingVertical: 6,
      paddingHorizontal: 12,
      position: "absolute",
      bottom: 0,
    },
  });

export default ShopCard;

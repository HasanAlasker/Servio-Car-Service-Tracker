import { Feather, Octicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { UseUser } from "../../context/UserContext";
import { capFirstLetter } from "../../functions/CapFirstLetterOfWord";
import {
  formatDayRange,
  formatOpenDays,
} from "../../functions/formatOpenHours";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useShopStore } from "../../store/admin/useShopStore";
import GapContainer from "../general/GapContainer";
import GhostBtn from "../general/GhostBtn";
import PriBtn from "../general/PriBtn";
import RowCont from "../general/RowCont";
import SeparatorComp from "../general/SeparatorComp";
import SimpleTitleText from "../general/SimpleTitleText";
import VerticalLine from "../general/VerticalLine";
import MText from "../text/MText";
import SText from "../text/SText";
import TText from "../text/TText";
import CardComp from "./CardComp";
import CardLeftBorder from "./CardLeftBorder";
import { alert } from "react-native-alert-queue";
import useAppToast from "../../hooks/useAppToast";

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
  distance,
}) {
  const { theme } = useTheme();
  const styles = useThemedStyles(getStyles);
  const { isShopOwner } = UseUser();
  const [showBtn, setShowBtn] = useState(false);
  const navigate = useNavigation();
  const toast = useAppToast();

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

  const handleDelete = async () => {
    try {
      const confimed = await alert.confirm();
      if (confimed) deleteShopA(id, activeTab);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const formatedDistance = (distance) => {
    if (distance > 1) return `${distance.toFixed(1)} km`;
    else return `${(distance * 1000).toFixed()} m`;
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
            <GapContainer gap={5} flex>
              <MText>{capFirstLetter(name)}</MText>
              <SText thin color={"sec_text"}>
                {description}
              </SText>
              {distance && (
                <TText>{formatedDistance(distance * 1.4)} away</TText>
                // multiply by 1.4 for road factor
              )}
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
                <CardLeftBorder
                  noPadding
                  miniTitle={"Services"}
                  customColor={"sec_text"}
                  parts={services}
                  status={"randomText"}
                />
              )}

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

          {showBtn && (
            <PriBtn
              style={{ marginTop: 10 }}
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
                  <GhostBtn full title={"Delete"} onPress={handleDelete} red />
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

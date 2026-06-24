import { StyleSheet, Pressable, Platform } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import useThemedStyles from "../../hooks/useThemedStyles";
import MText from "../text/MText";
import RowCont from "../general/RowCont";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import SText from "../text/SText";
import GapContainer from "../general/GapContainer";
import { capFirstLetter } from "../../functions/CapFirstLetterOfWord";
import { UseUser } from "../../context/UserContext";
import TText from "../text/TText";

function CardLeftBorder({
  icon,
  title,
  titleIcon,
  customColor,
  customTextColor,
  miniTitle,
  customText,
  data,
  status,
  parts,
  onPress,
  showBtn,
  style,
  noPadding,
  transparent,
  shadow,
  close,
  onClose
}) {
  const { theme } = useTheme();
  const styles = useThemedStyles(getstyles);
  const { isAdmin } = UseUser();

  let color = "";
  let text = "";
  let backColor = "";

  if (status) {
    if (miniTitle) {
      text = miniTitle;
      color = customColor;
    } else {
      switch (status) {
        case "soon":
          color = "gold";
          text = "Check Soon";
          break;
        case "due":
          color = "red";
          text = "Check Immediately";
          break;
        case "overdue":
          color = "red";
          text = "Dangerous";
          break;
        default:
          color = "sec_text";
          text = "Services";
      }
    }

    backColor = theme[color] + 20;
  } else {
    color = "main_text";
    backColor = theme.post;
  }

  const RenderParts = parts?.map((part) => (
    <RowCont key={part._id}>
      <MText>{"\u2022"}</MText>
      <SText thin>{capFirstLetter(part.name)}</SText>
    </RowCont>
  ));

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: transparent ? theme[customColor] + 15 : theme.post,
          borderColor: theme[color],
          paddingVertical: noPadding ? 0 : 15,
          paddingHorizontal: noPadding ? 0 : 18,
          // borderWidth:
          //   status == "soon" || status == "due" || status == "overdue" ? 3 : 0,
        },
        !transparent && shadow && styles.shadow,
        style,
      ]}
    >
      {status && (
        <GapContainer flex gap={5}>
          <RowCont spaceBetween>
            <RowCont>
              <MaterialCommunityIcons
                name={
                  icon
                    ? icon
                    : text === "Dangerous"
                      ? "alert-outline"
                      : text === "Check Immediately"
                        ? "car-brake-alert"
                        : text === "Check Soon"
                          ? "alert-circle-outline"
                          : "toolbox-outline"
                }
                size={20}
                color={theme[color]}
              />
              <TText thin={!customColor} color={color}>
                {text}
              </TText>
            </RowCont>
            {close && <Feather name="x" color={theme[color]} size={18} onPress={onClose}/>}
          </RowCont>
          {!customText ? (
            <RowCont style={{ flexWrap: "wrap", columnGap: 15 }}>
              {RenderParts}
            </RowCont>
          ) : (
            <SText
              thin
              style={{
                marginTop: 5,
                color: theme[customTextColor || "main_text"],
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              {customText}
            </SText>
          )}
        </GapContainer>
      )}
      {title != null && (
        <RowCont gap={10}>
          {isAdmin ? (
            <MaterialCommunityIcons
              name={titleIcon}
              size={26}
              color={theme[color]}
            />
          ) : (
            <Feather name={titleIcon} size={24} color={theme[color]} />
          )}

          <SText thin color={color}>
            {title}
          </SText>
        </RowCont>
      )}

      {data != null && (
        <SText style={{ top: Platform.OS === "web" && 2 }} color={color}>
          {data.toString()}
        </SText>
      )}

      {showBtn && (
        <MaterialCommunityIcons
          size={25}
          name="chevron-right"
          color={theme["sec_text"]}
          style={styles.v}
        />
      )}
    </Pressable>
  );
}

const getstyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.post,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 22,
      paddingVertical: 25,
      borderRadius: 15,
    },
    v: {
      alignSelf: "flex-end",
    },
    shadow: {
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.14)",
    },
  });

export default CardLeftBorder;

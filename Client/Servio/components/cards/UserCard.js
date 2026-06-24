import { View, StyleSheet } from "react-native";
import CardComp from "./CardComp";
import GapContainer from "../general/GapContainer";
import PriBtn from "../general/PriBtn";
import StatusLabel from "../general/StatusLabel";
import { useTheme } from "../../context/ThemeContext";
import { UseUser } from "../../context/UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import SquareTitle from "../general/SquareTitle";
import SeparatorComp from "../general/SeparatorComp";
import SimpleTitleText from "../general/SimpleTitleText";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import RowCont from "../general/RowCont";
import GhostBtn from "../general/GhostBtn";

function UserCard({
  passedUser,
  isEdit,
  handleEditPress,
  handleAction,
  isDeleted = null,
  short,
  setIsEdit,
  goToProfile,
}) {
  const { theme } = useTheme();
  const { user, isAdmin } = UseUser();
  const route = useRoute();
  const [showBtns, setShowBtns] = useState(false);
  const navigation = useNavigation();

  return (
    <CardComp
      style={{ marginHorizontal: "auto" }}
      short={short}
      onPress={() => {
        if (goToProfile) {
          navigation.navigate("UsersProfiles", { userId: passedUser._id });
        } else {
          setShowBtns(!showBtns);
          if (isEdit) {
            setIsEdit(false);
          }
        }
      }}
    >
      <GapContainer>
        <GapContainer gap={5}>
          <RowCont style={{ justifyContent: "space-between" }}>
            <SquareTitle icon={"account-outline"} title={passedUser?.name} />
            <Feather
              name={!showBtns ? "chevron-right" : "chevron-down"}
              color={theme.sec_text}
              size={25}
              style={{ alignSelf: "center" }}
            />
          </RowCont>
          {passedUser?.role !== "user" && (
            <StatusLabel status={passedUser?.role} style={{ marginTop: 10 }} />
          )}
          <SeparatorComp full color="faded" />

          <SimpleTitleText
            icon={"phone-outline"}
            text1={passedUser?.phone}
            title={"Phone"}
          />
          <SeparatorComp full color="faded" />
          <SimpleTitleText
            icon={"email-outline"}
            text1={passedUser?.email}
            title={"Email"}
          />
        </GapContainer>

        {showBtns && user._id === passedUser._id && route.name !== "Users" && (
          <View>
            <SeparatorComp full color="faded" />
            <GhostBtn
              full
              title={!isEdit ? "Edit Info" : "Cancel"}
              bule={!isEdit}
              red={isEdit}
              onPress={handleEditPress}
            />
          </View>
        )}
        {showBtns &&
          isDeleted !== null &&
          route.name === "Users" &&
          passedUser.role !== "admin" && (
            <PriBtn
              square
              full
              title={isDeleted ? "Un-Delete" : "Delete User"}
              black={isDeleted}
              red={!isDeleted}
              onPress={() => handleAction(isDeleted, passedUser._id)}
            />
          )}
      </GapContainer>
    </CardComp>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default UserCard;

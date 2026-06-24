import { StyleSheet } from "react-native";
import RowCont from "./RowCont";
import Pill from "./Pill";
import { UseUser } from "../../context/UserContext";
import HorizontalScroll from "./HorizontalScroll";
import SText from "../text/SText";
import GapContainer from "./GapContainer";
import { useTheme } from "../../context/ThemeContext";

function QuickActions(props) {
  const { isAdmin, isUser, isShopOwner, userLocation, fetchUserLocation } =
    UseUser();
  const { isDarkMode, toggleTheme } = useTheme();

  const handlePress = async () => {
    await fetchUserLocation();
  };

  const RenderedActions = () => {
    if (isUser)
      return (
        <>
          <Pill
            icon={"folder"}
            text={"History"}
            navigateTo={"History"}
            params={{ active: "2" }}
          />
          <Pill
            icon={"shopping-bag"}
            text={"Shops"}
            navigateTo={"Shops"}
            params={{ showBtn: false }}
            onPress={handlePress}
          />
          <Pill
            icon={isDarkMode ? "sun" : "moon"}
            text={isDarkMode ? "Light" : "Dark"}
            onPress={toggleTheme}
          />
          <Pill icon={"plus-circle"} text={"Car"} navigateTo={"AddCar"} />
        </>
      );

    if (isShopOwner)
      return (
        <>
          <Pill icon={"table"} text={"Schedule"} navigateTo={"Schedule"} />
          <Pill icon={"tool"} text={"Service"} navigateTo={"Service"} />
          <Pill
            icon={isDarkMode ? "sun" : "moon"}
            text={isDarkMode ? "Light" : "Dark"}
            onPress={toggleTheme}
          />
          <Pill icon={"plus-circle"} text={"Car"} navigateTo={"AddCar"} />
          <Pill icon={"plus-circle"} text={"Shop"} navigateTo={"AddShop"} />
        </>
      );

    if (isAdmin)
      return (
        <>
          <Pill
            icon={"message-circle"}
            text={"FeedBack"}
            navigateTo={"SeeSuggestions"}
          />
          <Pill icon={"folder"} text={"Reports"} navigateTo={"Reports"} />
          <Pill
            icon={"shopping-bag"}
            text={"Closed"}
            navigateTo={"DeletedShops"}
          />
          <Pill
            icon={isDarkMode ? "sun" : "moon"}
            text={isDarkMode ? "Light" : "Dark"}
            onPress={toggleTheme}
          />
        </>
      );
  };

  return (
    <GapContainer gap={20}>
      <SText thin color={"sec_text"}>
        Quick Actions
      </SText>
      <HorizontalScroll>
        <RowCont style={styles.container}>{RenderedActions()}</RowCont>
      </HorizontalScroll>
    </GapContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    gap: 15,
  },
});

export default QuickActions;

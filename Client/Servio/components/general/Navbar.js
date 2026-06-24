import { Platform, StyleSheet } from "react-native";
import { View } from "react-native";
import { useState } from "react";
import useThemedStyles from "../../hooks/useThemedStyles";
import { UseUser } from "../../context/UserContext";
import SettingsMenu from "./SettingsMenu";
import UserNav from "../navbars/UserNav";
import ShopOwner from "../navbars/ShopOwner";
import Admin from "../navbars/Admin";

function Navbar(props) {
  const { isUser, isShopOwner, isAdmin, user } = UseUser();
  const [isMenu, setIsMenu] = useState(false);
  const styles = useThemedStyles(getStyles);

  const handleMenu = () => {
    setIsMenu(!isMenu);
  };

  return (
    <>
      <SettingsMenu isVisible={isMenu} onClose={() => setIsMenu(false)} />
      {isUser ? (
        <UserNav onMenu={handleMenu} isMenu={isMenu} />
      ) : isShopOwner ? (
        <ShopOwner onMenu={handleMenu} isMenu={isMenu} />
      ) : (
        <Admin onMenu={handleMenu} isMenu={isMenu} />
      )}
      {Platform.OS !== "web" && <View style={styles.bottom}></View>}
    </>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    bottom: {
      position: "absolute",
      width: "100%",
      backgroundColor: theme.post,
      height: 50,
      bottom: 0,
      zIndex: 90,
    },
  });

export default Navbar;

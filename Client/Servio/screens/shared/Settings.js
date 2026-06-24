import { StyleSheet, Linking, Platform } from "react-native";
import MenuBackBtn from "../../components/general/MenuBackBtn";
import SeparatorComp from "../../components/general/SeparatorComp";
import { useNavigation } from "@react-navigation/native";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";
import GapContainer from "../../components/general/GapContainer";
import { UseUser } from "../../context/UserContext";
import { openURL } from "../../functions/openURL";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import SettingsGroup from "../../components/cards/SettingsGroup";
import SettingsOption from "../../components/general/SettingsOption";
import { getWebOS } from "../../functions/getWebOS";
import { useEffect, useState } from "react";

function Settings(props) {
  const styles = useThemedStyles(getStyles);
  const { toggleTheme, isDarkMode } = useTheme();
  const { logout, isUser, isAdmin, isShopOwner } = UseUser();
  const navigate = useNavigation();

  const [webOS, setWebOS] = useState(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const ua = navigator.userAgent;
    if (/android/i.test(ua)) setWebOS("android");
    else if (/iphone|ipad|ipod/i.test(ua)) setWebOS("ios");
    else if (/windows/i.test(ua)) setWebOS("windows");
    else if (/macintosh|mac os x/i.test(ua)) setWebOS("macos");
    else if (/linux/i.test(ua)) setWebOS("linux");
    else setWebOS("unknown");
  }, []);

  return (
    <SafeScreen>
      <ScrollScreen>
        <MenuBackBtn onClose={() => navigate.goBack()} />
        <GapContainer gap={20}>
          {Platform.OS === "web" && webOS === "android" && (
            <SettingsGroup label={"Application"}>
              <SettingsOption
                icon={"download"}
                text={"Download the app"}
                onPress={() =>
                  openURL(
                    "https://play.google.com/store/apps/details?id=com.hasan_alasker.Servio",
                  )
                }
              />
            </SettingsGroup>
          )}

          <SettingsGroup label={"Account"}>
            <SettingsOption
              icon={"user"}
              text={"My Profile"}
              onPress={() => navigate.navigate("Profile")}
            />
            {Platform.OS !== "web" && <SeparatorComp full color="light_gray" />}
            {Platform.OS !== "web" && (
              <SettingsOption
                icon={"shield"}
                text={"Permissions"}
                onPress={() => Linking.openSettings()}
              />
            )}
          </SettingsGroup>

          <SettingsGroup label={"Preferences"}>
            <SettingsOption
              icon={isDarkMode ? "sun" : "moon"}
              text={isDarkMode ? "Light mode" : "Dark mode"}
              onPress={toggleTheme}
            />
          </SettingsGroup>

          {!isAdmin && (
            <SettingsGroup label={!isShopOwner ? "Business" : "Cars"}>
              <SettingsOption
                icon={!isShopOwner ? "shopping-bag" : "clock"}
                text={!isShopOwner ? "Open Shop" : "Upcoming Services"}
                onPress={() =>
                  navigate.navigate(!isShopOwner ? "AddShop" : "Service")
                }
              />
            </SettingsGroup>
          )}

          <SettingsGroup label={"Support"}>
            <SettingsOption
              icon={"headphones"}
              text={"Help"}
              onPress={() =>
                openURL("https://servio-maintenance.netlify.app/how-it-works")
              }
            />
            <SeparatorComp full color="light_gray" />
            <SettingsOption
              icon={"message-circle"}
              text={"Suggestions"}
              onPress={() =>
                navigate.navigate(!isAdmin ? "Suggestions" : "SeeSuggestions")
              }
            />
            <SeparatorComp full color="light_gray" />
            <SettingsOption
              icon={"file-text"}
              text={"Privacy & Terms"}
              onPress={() =>
                openURL("https://servio-maintenance.netlify.app/privacy-policy")
              }
            />
          </SettingsGroup>

          <SettingsGroup label={"Danger Zone"}>
            <SettingsOption
              icon={"log-out"}
              text={"Logout"}
              onPress={logout}
              red
            />
            {isUser && <SeparatorComp full color="light_gray" />}
            {isUser && (
              <SettingsOption
                icon={"user-x"}
                text={"Delete Account"}
                red
                onPress={() =>
                  openURL(
                    "https://servio-maintenance.netlify.app/delete-account",
                  )
                }
              />
            )}
          </SettingsGroup>
        </GapContainer>
      </ScrollScreen>
    </SafeScreen>
  );
}
const getStyles = (theme) => StyleSheet.create({});

export default Settings;

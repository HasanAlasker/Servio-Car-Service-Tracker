import { useToast } from "react-native-toast-notifications";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const useAppToast = () => {
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const offset = insets.top + 5;

  const baseConfig = {
    placement: "top",
    duration: 3000,
    animationType: "slide-in",
    style: { marginTop: offset, borderRadius: 25, paddingHorizontal: 20 },
    textStyle: { fontSize: 18 },
  };

  const success = (message) =>
    toast.show(message, {
      ...baseConfig,
      type: "success",
      successColor: theme.green,
      icon: (
        <MaterialCommunityIcons
          name="check-circle"
          size={20}
          color={theme.always_white}
        />
      ),
    });

  const error = (message) =>
    toast.show(message, {
      ...baseConfig,
      type: "danger",
      dangerColor: theme.red,
      icon: (
        <MaterialCommunityIcons
          name="close-circle"
          size={20}
          color={theme.always_white}
        />
      ),
    });

  const info = (message) =>
    toast.show(message, {
      ...baseConfig,
      type: "normal",
      icon: (
        <MaterialCommunityIcons
          name="information"
          size={20}
          color={theme.always_white}
        />
      ),
    });

  return { success, error, info };
};

export default useAppToast;

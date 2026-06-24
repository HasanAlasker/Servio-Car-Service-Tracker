import { useTheme } from "../context/ThemeContext";

export default function useThemedStyles(makeStyles) {
  const { theme } = useTheme();
  return makeStyles(theme);
}
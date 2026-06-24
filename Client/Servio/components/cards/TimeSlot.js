import { View, StyleSheet, Pressable } from "react-native";
import RowCont from "../general/RowCont";
import StatusLabel from "../general/StatusLabel";
import { useTheme } from "../../context/ThemeContext";
import useThemedStyles from "../../hooks/useThemedStyles";
import SText from "../text/SText";
import Animated, {
  LinearTransition,
  SlideInLeft,
} from "react-native-reanimated";

function TimeSlot({ onPress, from, to, isBusy, selected, full }) {
  const { theme } = useTheme();
  const styles = useThemedStyles(getStyles);

  let active = selected === from;

  return (
    <Animated.View layout={LinearTransition} entering={SlideInLeft}>
      <Pressable
        disabled={isBusy}
        style={[
          styles.box,
          // isBusy && styles.disabled,
          active && styles.selected,
          { width: full ? "100%" : "90%" },
        ]}
        onPress={() => {
          onPress?.(from);
        }}
      >
        <RowCont style={styles.container}>
          <RowCont gap={10}>
            <Animated.View
            layout={LinearTransition}
              style={[
                styles.bar,
                {
                  backgroundColor: active
                    ? theme.blue
                    : !isBusy
                      ? theme.green
                      : theme.red,
                },
              ]}
            />
            <SText>
              {from} - {to}
            </SText>
          </RowCont>

          <StatusLabel
            style={{ alignSelf: "center" }}
            status={active ? "Selected" : isBusy}
            lable={isBusy ? "Busy" : active ? "Selected" : "Free"}
          />
        </RowCont>
      </Pressable>
    </Animated.View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    box: {
      width: "90%",
      marginHorizontal: "auto",
      backgroundColor: theme.post,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 12,
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.14)",
    },
    container: {
      justifyContent: "space-between",
      borderRadius: 12,
    },
    bar: {
      width: 4,
      height: 35,
    },
    disabled: {
      opacity: 0.5,
      boxShadow: "none",
    },
    selected: {
      // borderColor: theme.blue,
      // borderWidth: 1,
      // borderRadius: 12,
      // boxShadow: "0px 0px 5px rgba(0, 98, 255, 0.43)",
    },
  });

export default TimeSlot;

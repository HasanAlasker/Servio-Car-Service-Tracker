import { View, Text, Switch, StyleSheet, Pressable } from "react-native";
import { useFormikContext } from "formik";
import { useTheme } from "../../context/ThemeContext";
import useThemedStyles from "../../hooks/useThemedStyles";
import FormikDatePicker from "./FormikDatePicker";
import ErrorMessage from "./ErrorMessage";

function OpenHoursInput({
  name = "openHours",
  hasBeenSubmitted = false,
  dontShowLable,
}) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();
  const { values, errors, setFieldValue } = useFormikContext();
  const openHours = values[name] || [];
  const error = errors[name];

  const toggleDay = (index) => {
    const updated = [...openHours];
    updated[index] = {
      ...updated[index],
      isOpen: !updated[index].isOpen,
      from: !updated[index].isOpen ? "09:00" : "",
      to: !updated[index].isOpen ? "18:00" : "",
    };
    setFieldValue(name, updated);
  };

  const copyToAllOpenDays = (sourceIndex) => {
    const updated = openHours.map((day, index) => {
      if (day.isOpen && index !== sourceIndex) {
        return {
          ...day,
          from: openHours[sourceIndex].from,
          to: openHours[sourceIndex].to,
        };
      }
      return day;
    });
    setFieldValue(name, updated);
  };

  const parseTimeToDate = (timeString) => {
    if (!timeString) return new Date();
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
  };

  const formatTimeFromDate = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opening Hours</Text>

      {openHours.map((day, index) => (
        <View key={day.day} style={styles.dayRow}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayName}>{day.dayName}</Text>
            <Switch
              value={day.isOpen}
              onValueChange={() => toggleDay(index)}
              trackColor={{ false: theme.faded, true: theme.blue }}
              thumbColor={day.isOpen ? theme.white : theme.lightGray}
            />
          </View>

          {day.isOpen && (
            <>
              <View style={styles.timePickers}>
                <View style={styles.timeGroup}>
                  <Text style={styles.label}>From</Text>
                  <FormikDatePicker
                    dontShowLable
                    name={`${name}[${index}].from`}
                    mode="time"
                    icon="clock-time-four-outline"
                    placeholder="09:00"
                    hasBeenSubmitted={hasBeenSubmitted}
                    full
                  />
                </View>

                <View style={styles.timeGroup}>
                  <Text style={styles.label}>To</Text>
                  <FormikDatePicker
                    dontShowLable
                    name={`${name}[${index}].to`}
                    mode="time"
                    icon="clock-time-four-outline"
                    placeholder="18:00"
                    hasBeenSubmitted={hasBeenSubmitted}
                    full
                  />
                </View>
              </View>

              {index == 0 && (
                <Pressable
                  onPress={() => copyToAllOpenDays(index)}
                  style={styles.copyButton}
                >
                  <Text style={styles.copyButtonText}>
                    Copy to all open days
                  </Text>
                </Pressable>
              )}
            </>
          )}
        </View>
      ))}

      {hasBeenSubmitted && typeof error === "string" && (
        <ErrorMessage error={error} />
      )}
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      gap: 15,
      paddingVertical: 10,
      width: "90%",
      marginHorizontal: "auto",
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.main_text,
    },
    dayRow: {
      gap: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.faded,
      paddingBottom: 15,
    },
    dayHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dayName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.main_text,
    },
    timePickers: {
      flexDirection: "row",
      gap: 10,
    },
    timeGroup: {
      flex: 1,
      gap: 5,
    },
    label: {
      fontSize: 12,
      opacity: 0.7,
      color: theme.main_text,
    },
    copyButton: {
      paddingVertical: 8,
      backgroundColor: theme.backgroundColor,
      borderRadius: 15,
    },
    copyButtonText: {
      fontSize: 14,
      color: theme.blue,
      fontWeight: "600",
    },
  });

export default OpenHoursInput;

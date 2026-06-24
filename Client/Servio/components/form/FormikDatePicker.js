import { View, StyleSheet, Pressable, Text, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useFormikContext } from "formik";
import { useTheme } from "../../context/ThemeContext";
import useThemedStyles from "../../hooks/useThemedStyles";
import ErrorMessage from "./ErrorMessage";
import InputCont from "../general/InputCont";
import TText from "../text/TText";
import Animated, {
  LinearTransition,
  SlideInDown,
} from "react-native-reanimated";

function FormikDatePicker({
  name,
  placeholder = "Select date",
  lable = placeholder,
  icon = "calendar-outline",
  mode = "date",
  minimumDate,
  maximumDate,
  hasBeenSubmitted = false,
  full,
  dontShowLable,
  onDateChange,
}) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();
  const { values, errors, setFieldValue, handleBlur } = useFormikContext();
  const [show, setShow] = useState(false);
  const shouldShowError = hasBeenSubmitted && errors[name];

  // Get the value from the nested path
  const getNestedValue = (obj, path) => {
    return path
      .split(/[\[\].]/)
      .filter(Boolean)
      .reduce((acc, part) => acc?.[part], obj);
  };

  const fieldValue = getNestedValue(values, name);

  // Parse the value based on mode
  const getDateValue = () => {
    // If value is null, undefined, or an empty string, return a fresh Date
    if (!fieldValue || fieldValue === "") return null;

    if (mode === "time") {
      if (typeof fieldValue === "string" && fieldValue.includes(":")) {
        const [hours, minutes] = fieldValue.split(":");
        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        return date;
      }
    }

    const date = new Date(fieldValue);
    // Check if the date is actually valid before returning
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const selectedDate = getDateValue();

  const handlePress = () => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    // On Android, dismiss on any interaction
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (selectedDate) {
      if (mode === "time") {
        // Store as "HH:MM" string for time mode
        const hours = selectedDate.getHours().toString().padStart(2, "0");
        const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
        setFieldValue(name, `${hours}:${minutes}`);
      } else {
        // Store as Date for date/datetime modes
        setFieldValue(name, selectedDate);
        onDateChange?.(selectedDate);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return placeholder;

    if (mode === "time") {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    if (mode === "datetime") {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (Platform.OS === "web") {
    const inputType =
      mode === "time"
        ? "time"
        : mode === "datetime"
          ? "datetime-local"
          : "date";

    const getWebValue = () => {
      if (!selectedDate) return "";
      if (mode === "time") {
        // fieldValue is already stored as "HH:MM", use it directly
        if (typeof fieldValue === "string" && fieldValue.includes(":"))
          return fieldValue;
        // fallback: derive from date object
        const h = selectedDate.getHours().toString().padStart(2, "0");
        const m = selectedDate.getMinutes().toString().padStart(2, "0");
        return `${h}:${m}`;
      }
      if (mode === "datetime") return selectedDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
      return selectedDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
    };

    const handleWebChange = (e) => {
      const val = e.target.value;
      if (!val) return;

      if (mode === "time") {
        setFieldValue(name, val); // store as "HH:MM"
      } else {
        const date = new Date(val);
        setFieldValue(name, date);
        onDateChange?.(date);
      }
    };

    return (
      <InputCont>
        {!dontShowLable && (
          <TText thin color={"darker_gray"}>
            {lable}
          </TText>
        )}
        <View style={[styles.container, { width: full ? "100%" : "90%" }]}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={24}
              color={theme.main_text}
            />
          )}
          <input
            type={inputType}
            value={getWebValue()}
            onChange={handleWebChange}
            min={
              minimumDate ? minimumDate.toISOString().slice(0, 10) : undefined
            }
            max={
              maximumDate ? maximumDate.toISOString().slice(0, 10) : undefined
            }
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 16,
              color: "inherit",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          />
        </View>
        {shouldShowError && <ErrorMessage full error={errors[name]} />}
      </InputCont>
    );
  }

  return (
    <Animated.View layout={LinearTransition} entering={SlideInDown}>
      <InputCont>
        {!dontShowLable && (
          <TText thin color={"darker_gray"}>
            {lable}
          </TText>
        )}
        <Pressable
          style={[styles.container, { width: full ? "100%" : "90%" }]}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={24}
              color={theme.main_text}
            />
          )}
          <Text style={[styles.text, !selectedDate && styles.placeholder]}>
            {formatDate(selectedDate)}
          </Text>
        </Pressable>

        {shouldShowError && <ErrorMessage full error={errors[name]} />}

        {show && (
          <RNDateTimePicker
            mode={mode}
            value={selectedDate || new Date()}
            onChange={onChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            display={Platform.OS === "ios" ? "spinner" : "default"}
          />
        )}
      </InputCont>
    </Animated.View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      borderRadius: 15,
      borderColor: theme.faded,
      borderWidth: 1,
      backgroundColor: theme.post,
      paddingVertical: 8,
      paddingHorizontal: 15,
      gap: 10,
      minHeight: 40,
      alignItems: "center",
      marginHorizontal: "auto",
      width: "100%",
    },
    text: {
      color: theme.darker_gray,
      fontSize: 16,
      flex: 1,
    },
    placeholder: {
      opacity: 0.6,
    },
  });

export default FormikDatePicker;

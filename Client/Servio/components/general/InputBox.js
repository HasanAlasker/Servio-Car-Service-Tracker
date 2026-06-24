import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import useThemedStyles from "../../hooks/useThemedStyles";
import TText from "../text/TText";
import InputCont from "./InputCont";

function InputBox({
  placeholder,
  penOn,
  icon,
  value,
  isPassword,
  isBox,
  lable = placeholder,
  style,
  full,
  onChangeText,
  ...rest
}) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();
  const [isHidden, setIsHidden] = useState(isPassword ? true : false);
  const [isFocused, setFocus] = useState(false);

  const handleHidden = () => {
    setIsHidden(!isHidden);
  };

  return (
    <InputCont style={[styles.whole]} full={full}>
      {lable && (
        <TText thin color={"darker_gray"}>
          {lable}
        </TText>
      )}
      <View style={[styles.container, isFocused && styles.focus, style]}>
        {penOn && <Feather name="edit-3" size={24} color={theme.main_text} />}
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={theme.main_text}
            style={isBox && styles.padding}
          />
        )}
        <TextInput
          onFocus={() => setFocus(true)}
          onEndEditing={() => setFocus(false)}
          style={[
            styles.text,
            isBox && {
              textAlignVertical: "top",
              paddingTop: 6,
              flexWrap: "wrap",
            },
            !value && styles.placeholder,
          ]}
          multiline={isBox}
          placeholder={placeholder}
          placeholderTextColor={theme.darker_gray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isHidden}
          {...rest}
        />
        {isPassword && (
          <Pressable onPress={handleHidden}>
            <Feather
              name={isHidden ? "eye" : "eye-off"}
              size={24}
              color={theme.main_text}
            />
          </Pressable>
        )}
      </View>
    </InputCont>
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
      paddingVertical: 10,
      paddingHorizontal: 15,
      width: "100%",
      marginHorizontal: "auto",
      // marginTop: 20,
      gap: 10,
      minHeight: 40,
      maxWidth: 600,
    },
    text: {
      color: theme.darker_gray,
      fontSize: 16,
      flex: 1,
      padding: 0,
      margin: 0,
      textAlignVertical: "center",
      outlineStyle: "none",
    },
    placeholder: {
      opacity: 0.6,
    },
    padding: {
      marginTop: 5,
    },
    focus: {
      borderColor: theme.blue,
      // borderWidth: 1.5,
    },
  });

export default InputBox;

import { View, StyleSheet } from "react-native";
import InputBox from "./InputBox";

function SearchBar({ onChangeText }) {
  return (
    <InputBox
      lable={null}
      full
      icon={"magnify"}
      placeholder={"Search"}
      style={styles.container}
      full
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
});

export default SearchBar;

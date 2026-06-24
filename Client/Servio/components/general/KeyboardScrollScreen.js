import { Platform, StyleSheet, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ScrollScreen from "./ScrollScreen";

function KeyboardScrollScreen({ children, ...other }) {
  if (Platform.OS === "web")
    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          width: "100%",
          paddingVertical: 30,
          maxWidth: 650,
          marginHorizontal: "auto",
        }}
      >
        {children}
      </ScrollView>
    );
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 30, paddingTop: 20 }}
      enableOnAndroid={true}
      extraScrollHeight={60}
      showsVerticalScrollIndicator={false}
      {...other}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default KeyboardScrollScreen;

import { useState } from "react";
import {
  Image,
  StyleSheet,
  Pressable,
  View,
  Alert,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ErrorMessage from "./ErrorMessage";
import {
  selectImageFromCamera,
  selectImageFromLibrary,
} from "../../functions/addImage";
import useThemedStyles from "../../hooks/useThemedStyles";
import { useTheme } from "../../context/ThemeContext";
import AppText from "../../config/AppText";
import SText from "../text/SText";

function AddImageBtn({
  image,
  onImageChange,
  error,
  errorMessage,
  allowCamera = true,
  containerStyle,
  touchableAreaStyle,
}) {
  const styles = useThemedStyles(getStyles);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelection = () => {
    if (allowCamera) {
      if (Platform.OS === "web") {
        handleLibraryPress();
      } else {
        // Show options for camera or library
        Alert.alert("Select Image", "Choose an option", [
          {
            text: "Camera",
            onPress: handleCameraPress,
          },
          {
            text: "Photo Library",
            onPress: handleLibraryPress,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]);
      }
    } else {
      handleLibraryPress();
    }
  };

  const handleLibraryPress = async () => {
    setIsLoading(true);
    try {
      const imageUri = await selectImageFromLibrary({
        quality: 0.7,
        allowsEditing: true,
        aspect: [31, 20],
      });

      if (imageUri && onImageChange) {
        onImageChange(imageUri);
      }
    } catch (error) {
      console.error("Error selecting image from library:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraPress = async () => {
    setIsLoading(true);
    try {
      const imageUri = await selectImageFromCamera({
        quality: 0.7,
        allowsEditing: true,
        aspect: [31, 20],
      });

      if (imageUri && onImageChange) {
        onImageChange(imageUri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePress = () => {
    if (image) {
      if (Platform.OS === "web") {
        handleLibraryPress();
      } else {
        // If image exists, show options to change or remove
        Alert.alert("Image Options", "What would you like to do?", [
          {
            text: "Change Image",
            onPress: handleImageSelection,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]);
      }
    } else {
      handleImageSelection();
    }
  };

  return (
    <View>
      <View style={[styles.container, containerStyle]}>
        <Pressable
          style={[styles.touchableArea, touchableAreaStyle]}
          onPress={handleImagePress}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {image ? (
            // Show image with overlay
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: image }}
                onError={(e) =>
                  console.log("Image load error:", e.nativeEvent.error)
                }
              />
              <View style={styles.overlay}>
                <MaterialCommunityIcons
                  name="pencil"
                  color={theme.always_white}
                  size={24}
                />
              </View>
            </View>
          ) : (
            // Show placeholder
            <View style={styles.placeholderContainer}>
              <MaterialCommunityIcons
                name={isLoading ? "loading" : "image-plus"}
                color={theme.sec_text}
                size={50}
              />
              <SText thin color={"sec_text"}>
                {isLoading ? "Loading..." : "Add Image"}
              </SText>
            </View>
          )}
        </Pressable>
      </View>

      {error && errorMessage && <ErrorMessage error={errorMessage} />}
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      width: "90%",
      aspectRatio: 31 / 20,
      marginHorizontal: "auto",
      marginBottom: 10,
      // marginTop: 25,
      alignSelf: "center", // Better centering
    },
    touchableArea: {
      flex: 1,
      backgroundColor: theme.post,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: theme.faded,
      overflow: "hidden",
    },
    placeholderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    text: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.darker_gray,
      marginTop: 10,
      textAlign: "center",
    },
    imageContainer: {
      flex: 1,
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    overlay: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderRadius: 20,
      padding: 8,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default AddImageBtn;

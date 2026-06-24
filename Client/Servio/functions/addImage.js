import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export const selectImageFromLibrary = async (options = {}) => {
  try {
    // Only request permission on Android 12 and below
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!result.granted) {
        alert("Enable permission to continue");
        return null;
      }
    }

    const defaultOptions = {
      mediaTypes: ['images'],
      quality: 0.5,
      ...options,
    };

    const result = await ImagePicker.launchImageLibraryAsync(defaultOptions);

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    alert("Error while choosing image");
    return null;
  }
};

export const selectImageFromCamera = async (options = {}) => {
  try {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      alert("Camera permission required");
      return null;
    }

    const defaultOptions = {
      mediaTypes: ['images'],
      quality: 0.5,
      ...options,
    };

    const result = await ImagePicker.launchCameraAsync(defaultOptions);

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    alert("Error while taking photo");
    return null;
  }
};
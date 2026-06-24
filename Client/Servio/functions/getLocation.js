import * as Location from "expo-location";
import { Platform } from "react-native";

export async function getApproximateLocation() {
  const { status, canAskAgain } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    if (!canAskAgain) return { denied: true };
    return null;
  }

  const coords = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Low,
  });

  let city, country, street, countryCode, region, district;

  if (Platform.OS !== "web") {
    const [place] = await Location.reverseGeocodeAsync({
      latitude: coords.coords.latitude,
      longitude: coords.coords.longitude,
    });
    city = place.city ?? place.subregion ?? place.region;
    country = place.country;
    street = place.street || null;
    countryCode = place.isoCountryCode;
    region = place.region;
    district = place.district;
  } else {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${coords.coords.latitude}&lon=${coords.coords.longitude}&format=json`,
      { headers: { "Accept-Language": "en" } },
    );
    const place = await response.json();
    // console.log(place)
    const addr = place.address;
    city = addr.state ?? addr.city ?? addr.town ?? addr.village ?? addr.county;
    country = addr.country;
    street = addr.road || null;
    countryCode = addr.country_code?.toUpperCase();
    region = addr.state;
    district = addr.suburb ?? addr.district ?? addr.county;
  }

  return {
    city,
    country,
    street,
    countryCode,
    region,
    district,
    lat: coords.coords.latitude,
    lng: coords.coords.longitude,
    alt: coords.coords.altitude,
  };
}

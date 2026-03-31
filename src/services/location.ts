import * as Location from "expo-location";
import type { LatLng } from "../types";

export type LocationPermissionStatus = "granted" | "denied" | "undetermined";

/**
 * Request foreground location permission.
 */
export async function requestLocationPermission(): Promise<LocationPermissionStatus> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status as LocationPermissionStatus;
}

/**
 * Get the current device position.
 */
export async function getCurrentPosition(): Promise<LatLng> {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

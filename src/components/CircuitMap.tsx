import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useStridoStore } from "../stores/useStridoStore";
import type { LatLng } from "../types";

const DEFAULT_DELTA = 0.01;

export function CircuitMap() {
  const mapRef = useRef<MapView>(null);
  const userLocation = useStridoStore((s) => s.userLocation);
  const circuit = useStridoStore((s) => s.circuit);
  const locationError = useStridoStore((s) => s.locationError);

  // Fit map to circuit when it changes
  useEffect(() => {
    if (circuit && circuit.polyline.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(circuit.polyline, {
        edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
        animated: true,
      });
    }
  }, [circuit]);

  if (locationError) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{locationError}</Text>
      </View>
    );
  }

  const initialRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: DEFAULT_DELTA,
        longitudeDelta: DEFAULT_DELTA,
      }
    : {
        latitude: 48.8566, // Paris default
        longitude: 2.3522,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {circuit && circuit.polyline.length > 0 && (
          <Polyline
            coordinates={circuit.polyline}
            strokeColor="#4F46E5"
            strokeWidth={4}
          />
        )}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Depart / Arrivee"
            pinColor="#4F46E5"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 16,
    marginTop: 8,
  },
  map: {
    flex: 1,
    minHeight: 300,
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

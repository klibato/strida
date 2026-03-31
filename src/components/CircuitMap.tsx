import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { useStridoStore } from "../stores/useStridoStore";

const DEFAULT_DELTA = 0.01;

// react-native-maps doesn't support web — lazy import for native only
let MapView: any = null;
let Polyline: any = null;
let Marker: any = null;

if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Polyline = Maps.Polyline;
  Marker = Maps.Marker;
}

export function CircuitMap() {
  const mapRef = useRef<any>(null);
  const userLocation = useStridoStore((s) => s.userLocation);
  const circuit = useStridoStore((s) => s.circuit);
  const locationError = useStridoStore((s) => s.locationError);

  // Fit map to circuit when it changes
  useEffect(() => {
    if (circuit && circuit.polyline.length > 0 && mapRef.current?.fitToCoordinates) {
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

  // Web fallback — no map support
  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, styles.webFallback]}>
        <Text style={styles.webFallbackText}>
          Carte disponible uniquement sur mobile (iOS / Android)
        </Text>
        {circuit && (
          <Text style={styles.webFallbackSub}>
            Circuit genere : {(circuit.distance / 1000).toFixed(1)} km
          </Text>
        )}
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
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
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
  webFallback: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  webFallbackText: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
  },
  webFallbackSub: {
    color: "#4F46E5",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
});
